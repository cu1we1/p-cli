import { browserInfo } from "@lego";
import closeBtn from "@img/hotelDetails/hotelDetails_closeBtn.png";
import entertainment from "@img/hotelDetails/hotelDetails_entertainment.png";
import entertainmentDark from "@img/hotelDetails/hotelDetails_entertainment_dark.png";
import food from "@img/hotelDetails/hotelDetails_food.png";
import foodDark from "@img/hotelDetails/hotelDetails_food_dark.png";
import frontService from "@img/hotelDetails/hotelDetails_frontService.png";
import frontServiceDark from "@img/hotelDetails/hotelDetails_frontService_dark.png";
import generalFacilities from "@img/hotelDetails/hotelDetails_generalFacilities.png";
import generalFacilitiesDark from "@img/hotelDetails/hotelDetails_generalFacilities_dark.png";
import internet from "@img/hotelDetails/hotelDetails_internet.png";
import internetDark from "@img/hotelDetails/hotelDetails_internet_dark.png";
import traffic from "@img/hotelDetails/hotelDetails_traffiic.png";
import trafficDark from "@img/hotelDetails/hotelDetails_traffiic_dark.png";
import location from "@img/hotelDetails/hotelDetails_nearby_location.png";
const hotelDetails = {
  closeBtn,
  entertainment,
  food,
  frontService,
  generalFacilities,
  internet,
  traffic,
  location
};
const hotelDetailsDark = {
  closeBtn,
  entertainment: entertainmentDark,
  food: foodDark,
  frontService: frontServiceDark,
  generalFacilities: generalFacilitiesDark,
  internet: internetDark,
  traffic: trafficDark,
  location
};
const result = {
  0: hotelDetails,
  1: hotelDetailsDark
};
export default result[browserInfo.theme] || hotelDetails;
