////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import clone from '../src';

/**
 * Unit test the `clone()` function to clone objects with naming conversion.
 *
 * @author Haixing Hu
 */
describe('clone objects with naming conversion', () => {
  const obj = {
    firstName: 'Haixing',
    lastName: 'Hu',
    age: 40,
    address: {
      streetAddress: '123 Main St',
      cityName: 'Nanjing',
    },
  };

  test('clone with convertNaming = true (default styles)', () => {
    const options = {
      convertNaming: true,
    };
    const copy = clone(obj, options);
    expect(copy.firstName).toBe('Haixing');
    expect(copy.lastName).toBe('Hu');
    expect(copy.age).toBe(40);
    expect(copy.address.streetAddress).toBe('123 Main St');
    expect(copy.address.cityName).toBe('Nanjing');
  });

  test('clone from LOWER_CAMEL to UPPER_CAMEL', () => {
    const options = {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_CAMEL',
      targetNamingStyle: 'UPPER_CAMEL',
    };
    const copy = clone(obj, options);
    expect(copy.FirstName).toBe('Haixing');
    expect(copy.LastName).toBe('Hu');
    expect(copy.Age).toBe(40);
    expect(copy.Address.StreetAddress).toBe('123 Main St');
    expect(copy.Address.CityName).toBe('Nanjing');
  });

  test('clone from LOWER_CAMEL to LOWER_UNDERSCORE', () => {
    const options = {
      convertNaming: true,
      sourceNamingStyle: 'LOWER_CAMEL',
      targetNamingStyle: 'LOWER_UNDERSCORE',
    };
    const copy = clone(obj, options);
    expect(copy.first_name).toBe('Haixing');
    expect(copy.last_name).toBe('Hu');
    expect(copy.age).toBe(40);
    expect(copy.address.street_address).toBe('123 Main St');
    expect(copy.address.city_name).toBe('Nanjing');
  });

  test('clone with convertNaming = true, but missing naming styles', () => {
    // This should cover the branch cases where one of the naming styles is null
    const options1 = {
      convertNaming: true,
      sourceNamingStyle: null,
    };
    const copy1 = clone(obj, options1);
    expect(copy1.firstName).toBe('Haixing');

    const options2 = {
      convertNaming: true,
      targetNamingStyle: null,
    };
    const copy2 = clone(obj, options2);
    expect(copy2.firstName).toBe('Haixing');

    const options3 = {
      convertNaming: true,
      sourceNamingStyle: null,
      targetNamingStyle: null,
    };
    const copy3 = clone(obj, options3);
    expect(copy3.firstName).toBe('Haixing');
  });

  test('clone with convertNaming = false (default)', () => {
    const options = {
      convertNaming: false,
      sourceNamingStyle: 'LOWER_CAMEL',
      targetNamingStyle: 'PASCAL',
    };
    const copy = clone(obj, options);
    expect(copy.firstName).toBe('Haixing');
    expect('FirstName' in copy).toBe(false);
  });
});
