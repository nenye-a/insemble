/* eslint-disable import/no-extraneous-dependencies */

import enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'whatwg-fetch';

enzyme.configure({ adapter: new Adapter() });
