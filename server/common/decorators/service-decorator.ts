export interface IService {
  // add some methods or something to distinguish from {}
  Build(): void;
}

// add a registry of the type you expect
namespace IService {

  type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
  }
  
  const implementations: Constructor<IService>[] = [];

  export function GetImplementations(): Constructor<IService>[] {
    return implementations;
  }


  export function Register<T extends Constructor<IService>>(ctor: T) {
    implementations.push(ctor);
    return ctor;
  }
}