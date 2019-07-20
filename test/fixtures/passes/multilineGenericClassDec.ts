type Caterpillar = 'caterpillar';
type Butterfly = 'butterfly'

class MultilineGenericClass<
  T1,
  T2
> {
  constructor() {}
}

class MultilineGenericClassDec extends MultilineGenericClass<
  Caterpillar,
  Butterfly
> {
  constructor() {
    super();
  }
}