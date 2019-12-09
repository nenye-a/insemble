import { combineReducers } from 'redux';
import auth from './auth';
import space from './space';

export default combineReducers({
  auth,
  space,
});
