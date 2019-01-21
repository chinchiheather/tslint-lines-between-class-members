interface SomeInterface {
    name: string;
}

export class SomeClass
  implements SomeInterface {
  constructor() { }

  name = 'test';
}
