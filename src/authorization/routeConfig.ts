import Roles from './roles'
import { RouteNames } from './routeNames'

const routeConfig: { [key: string]: { [key: string]: string } } = {
  auth: {
    default: RouteNames.login,
    [RouteNames.register]: RouteNames.register,
    [RouteNames.login]: RouteNames.login
  },
  [Roles.user]: {
    default: RouteNames.home,
    [RouteNames.explore]: RouteNames.explore,
    [RouteNames.home]: RouteNames.home,
    [RouteNames.profile]: RouteNames.profile,
    [RouteNames.messages]: RouteNames.messages
  },
  [Roles.admin]: {
    default: RouteNames.admin_overview,
    [RouteNames.admin_advertisements]: RouteNames.admin_advertisements,
    [RouteNames.admin_overview]: RouteNames.admin_overview,
    [RouteNames.admin_reports]: RouteNames.admin_reports,
    [RouteNames.admin_user_management]: RouteNames.admin_user_management,
    [RouteNames.admin_business_management]: RouteNames.admin_business_management
  },
  [Roles.business]: {
    default: RouteNames.business_analytics,
    [RouteNames.business_advertisements]: RouteNames.business_advertisements,
    [RouteNames.business_analytics]: RouteNames.business_analytics,
    [RouteNames.business_transactions]: RouteNames.business_transactions,
    [RouteNames.explore]: RouteNames.explore,
    [RouteNames.home]: RouteNames.home,
    [RouteNames.profile]: RouteNames.profile,
    [RouteNames.messages]: RouteNames.messages
  }
}

export default routeConfig
