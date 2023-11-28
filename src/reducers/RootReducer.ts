import {combineReducers} from 'redux';
import AuthSlice from './AuthSlice';
import WalkthroughSlice from './WalkthroughSlice';
import UserContextSlice from './UserContextSlice';
import syncStatusSlice from './SyncStatusSlice';
import syncSlice from './SyncSlice';
import CustomerLandingSlice from './CustomerLandingSlice';
import ProspectLandingSlice from './ProspectLandingSlice';

const rootReducer = combineReducers({
  auth: AuthSlice,
  walkthrough: WalkthroughSlice,
  userContext: UserContextSlice,
  syncStatus: syncStatusSlice,
  sync: syncSlice,
  customerLanding: CustomerLandingSlice,
  prospectLanding: ProspectLandingSlice,
});

export default rootReducer;
