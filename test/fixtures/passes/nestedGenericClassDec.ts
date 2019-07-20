interface Puffin<T> {}

class NestedGenericBaseClass<T> {
  constructor() {}
}

export abstract class NestedGenericClassDec<
  T extends Puffin<T>
> extends
  NestedGenericBaseClass<T> {
  constructor() {
    super();
  }
}