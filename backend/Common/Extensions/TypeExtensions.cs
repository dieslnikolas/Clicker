using System.Reflection;
using Clicker.Backend.Common.Validations;

namespace Clicker.Backend.Common.Extensions;

public static class TypeExtensions
{
    /// <summary>
    /// Find all implementations of Validator
    /// </summary>
    /// <returns></returns>
    public static IEnumerable<Type> GetValidators()
    {
        var abstractValidatorType = typeof(Common.Validations.ValidatorBase<>);
        var validatorInterface = typeof(IClickerValidator<>);
        var validatorTypes = abstractValidatorType
            .Assembly
            .GetTypes()
            .Where(childClass => IsClickerValidator(childClass, validatorInterface));
        return validatorTypes;
    }

    /// <summary>
    /// Returns command or query (T generic validator type)
    /// </summary>
    /// <param name="implementation"></param>
    /// <returns></returns>
    public static Type? GetValidatorInterface(this Type implementation)
    {
        // Searching IValidator implementations
        var validatorType = typeof(Common.Validations.IClickerValidator<>);
        
        // Find all impelentations of type
        Type? resolvedType = null;
        if (implementation.BaseType != null)
        {
            var cmdType = implementation.BaseType.GenericTypeArguments[0];
            resolvedType = validatorType.MakeGenericType(cmdType);
        }

        // Check
        if (resolvedType == null)
        {
            throw new Exception(string.Format("Cant resolve interface type {validatorType} for {implementation}", validatorType, implementation));
        }

        return resolvedType;
    }

    /// <summary>
    /// Alternative version of <see cref="Type.IsSubclassOf"/> that supports raw generic types (generic types without
    /// any type parameters).
    /// </summary>
    /// <param name="parentClass">The base type class for which the check is made.</param>
    /// <param name="derivedClass">To type to determine for whether it derives from <paramref name="parentClass"/>.</param>
    public static bool IsSubclassOf(this Type derivedClass, Type parentClass)
    {
        while (derivedClass != typeof(object) && derivedClass != null)
        {
            var cur = derivedClass.IsGenericType ? derivedClass.GetGenericTypeDefinition() : derivedClass;
            if (parentClass == cur)
            {
                return true;
            }

            derivedClass = derivedClass.BaseType;
        }

        return false;
    }
    
    /// <summary>
    /// Check if class is clicker validator
    /// </summary>
    /// <param name="childClass"></param>
    /// <param name="validatorInterface"></param>
    /// <returns></returns>
    private static bool IsClickerValidator(Type childClass, MemberInfo validatorInterface)
    {
        return childClass.GetInterface(validatorInterface.Name) != null && !childClass.IsAbstract;
    }
}