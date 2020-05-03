/**
 * Action creators
 */
import {
  SIGN_IN,
  SIGN_OUT,
  NETWORK_ACTION,
  PROFILE_AVAILABLE,
  PROFILE_CLEAR,
  SITEINFO_AVAILABLE,
  AUTH_CHECKED,
  SET_MESSAGE,
  CLEAR_MESSAGE
} from "./actionTypes.js";
import {
  BACKEND,
  JWT_COOKIE_NAME,
  USERID_COOKIE_NAME
} from "../config/constants.js";
import FetchBuilder from "../lib/fetch.js";
import { removeCookie } from "../lib/session.js";

export function signedIn(userid, token) {
  return async (dispatch, getState) => {
    dispatch({ type: SIGN_IN, token, userid });
    dispatch(refreshUserProfile(userid));
  };
}

export function refreshUserProfile(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(networkAction(true));
      const userID = userId || getState().profile.email;

      const query = `
      { profile: getUser(email: "${userID}") {
          name,
          isCreator,
          id,
          isAdmin,
          email,
          purchases
        }
      }
      `;
      const fetch = new FetchBuilder()
        .setUrl(`${BACKEND}/graph`)
        .setPayload(query)
        .setIsGraphQLEndpoint(true)
        .setAuthToken(getState().auth.token)
        .build();
      const response = await fetch.exec();

      dispatch(networkAction(false));
      dispatch(updateProfile(response.profile));
    } finally {
      dispatch(networkAction(false));
    }
  };
}

export function signedOut() {
  return dispatch => {
    removeCookie(JWT_COOKIE_NAME);
    removeCookie(USERID_COOKIE_NAME);
    dispatch(clearProfile());
    dispatch({ type: SIGN_OUT });
  };
}

export function authHasBeenChecked() {
  return dispatch => {
    dispatch({ type: AUTH_CHECKED });
  };
}

export function networkAction(flag) {
  return dispatch => dispatch({ type: NETWORK_ACTION, flag });
}

export function updateProfile(profile) {
  return { type: PROFILE_AVAILABLE, profile };
}

export function clearProfile() {
  return { type: PROFILE_CLEAR };
}

export function newSiteInfoAvailable(info) {
  return { type: SITEINFO_AVAILABLE, siteinfo: info };
}

export function updateSiteInfo() {
  return async (dispatch, getState) => {
    try {
      dispatch(networkAction(true));

      const query = `
      { site: getSiteInfo {
          title,
          subtitle,
          logopath,
          currencyUnit,
          currencyISOCode,
          copyrightText,
          about,
          paymentMethod,
          stripePublishableKey,
          themePrimaryColor,
          themeSecondaryColor,
          codeInjectionHead
        }
      }
      `;
      const fetch = new FetchBuilder()
        .setUrl(`${BACKEND}/graph`)
        .setPayload(query)
        .setIsGraphQLEndpoint(true)
        .build();
      const response = await fetch.exec();

      dispatch(networkAction(false));
      dispatch(newSiteInfoAvailable(response.site));
    } finally {
      dispatch(networkAction(false));
    }
  };
}

export function setAppMessage(message) {
  return dispatch => dispatch({ type: SET_MESSAGE, message });
}

export function clearAppMessage() {
  return dispatch => dispatch({ type: CLEAR_MESSAGE });
}

// export function setCustomisations(customisations) {
//   return { type: CUSTOMISATIONS_AVAILABLE, customisations };
// }

// export function updateCustomisations() {
//   return async dispatch => {
//     try {
//       const query = `
//       { customisations: getCustomisations {
//           themePrimaryColor,
//           themeSecondaryColor,
//           codeInjectionHead
//         }
//       }
//       `;
//       const fetch = new FetchBuilder()
//         .setUrl(`${BACKEND}/graph`)
//         .setPayload(query)
//         .setIsGraphQLEndpoint(true)
//         .build();
//       const response = await fetch.exec();
//       dispatch(setCustomisations(response.customisations));
//     } catch {
//       // fail silently
//     }
//   };
// }
