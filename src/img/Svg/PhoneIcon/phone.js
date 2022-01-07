import {
  launchMessageByContactID,
  launchCallByContactID,
  trackClickBaseEle
} from "@lego";
export const phoneFn = (event, contactId, phoneNumber = "", type = "phone") => {
  if (contactId) {
    let target = event.target,
      log = target.getAttribute("data-log");
    while (target && !log) {
      target = target.parentNode;
      log = target.getAttribute("data-log");
    }
    trackClickBaseEle(target);
    type === "message"
      ? launchMessageByContactID(contactId, phoneNumber)
      : launchCallByContactID(contactId, phoneNumber);
  }
};
