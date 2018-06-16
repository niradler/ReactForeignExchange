import React from 'react';
import { shallow } from 'enzyme';
import Table from './Table';

describe('<Table />', () => {
  test('renders', () => {
    const wrapper = shallow(<Table />);
    expect(wrapper).toMatchSnapshot();
  });
});
