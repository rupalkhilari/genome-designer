import * as ActionTypes from '../constants/ActionTypes';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: ActionTypes.RESET_ERROR_MESSAGE
  };
}