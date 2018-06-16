import React from 'react';
import { shallow } from 'enzyme';
import CurrencyConverter from './CurrencyConverter';

describe('<CurrencyConverter />', () => {
  test('renders', () => {
    const wrapper = shallow(<CurrencyConverter />);
    expect(wrapper).toMatchSnapshot();
  });
});
