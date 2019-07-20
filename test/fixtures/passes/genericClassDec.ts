type Bee = 'bee';

class GenericClass<T> {
  constructor() {}
}

class GenericClassDec extends GenericClass<Bee> {
  constructor() {
    super();
  }
}