export const Controller = (prefix: string = ''): ClassDecorator => {
  return (target: any) => {

    let t = 1;
    // // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    // if (! Reflect.hasMetadata('routes', target)) {
    //   Reflect.defineMetadata('routes', [], target);
    // }
  };
};