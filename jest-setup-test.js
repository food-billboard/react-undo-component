import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.URL.createObjectURL = jest.fn(() => 'faker createObjectURL');

configure({ adapter: new Adapter() });
