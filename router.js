const { Router } = require("express");
const multer = require("multer");
//admin imports
const adminSignup = require("./controllers/admin/authenticate/signup");
const adminLogin = require("./controllers/admin/authenticate/login");
const adminGetAllAgents = require("./controllers/admin/agent/getAllAgents");
const adminGetAgentProperties = require("./controllers/admin/agent/getAgentProperties");
const adminGetAllUsers = require("./controllers/admin/users/getAllUsers");
const adminDeleteUser = require("./controllers/admin/users/deleteUser");
const adminDeleteAgent = require("./controllers/admin/agent/deleteAgent");
const adminAddNewLocation = require("./controllers/admin/location/addNewLocation");
const adminAddNewArea = require("./controllers/admin/location/area/addNewArea");
const createFeatured = require("./controllers/admin/featured/createFeatured");
const getCurrentUser = require("./controllers/admin/users/getCurrentUser");
//user imports
const userSignup = require("./controllers/user/authenticate/signup");
const userLogin = require("./controllers/user/authenticate/login");
const userChangeProfilePhoto = require("./controllers/user/authenticate/changeProfilePhoto");
const contactAgent = require("./controllers/user/property/contactAgent");
//property imports
const getAllProperties = require("./controllers/user/property/getAllProperties");
const getPropertyById = require("./controllers/property/getPropertyById");
const getPropertiesByLocation = require("./controllers/property/getPropertiesByLocation");
const getPropertiesByType = require("./controllers/property/getPropertiesByType");
const getPropertiesByArea = require("./controllers/property/getPropertiesByArea");
const getPropertyByFilter = require("./controllers/property/getPropertiesByFilter");
const getAllLocation = require("./controllers/property/location/getAllLocation");
const getAreaInLocation = require("./controllers/property/location/getAreaInLocation");
//agent importsFlocation
const agentSignup = require("./controllers/agent/authenticate/signup");
const agentLogin = require("./controllers/agent/authenticate/login");
const agentChangeProfilePhoto = require("./controllers/agent/authenticate/changeProfilePhoto");
const getAgentProperties = require("./controllers/agent/property/getAgentProperties");
const addPropertyByAgent = require("./controllers/agent/property/addProperty");
const deletePropertyByAgent = require("./controllers/agent/property/deleteProperty");
const editPropertyByAgent = require("./controllers/agent/property/editPropertyDetails");
const addImageToProperty = require("./controllers/agent/property/addImageToProperty");
const addImageToLocation = require("./controllers/property/location/addImageToLocation.js");
const deleteImageFromProperty = require("./controllers/agent/property/deleteImageFromProperty");
const getPropertiesWithBuyers = require("./controllers/agent/property/buyers/getPropertiesWithBuyers");
const getBuyersByProperty = require("./controllers/agent/property/buyers/getBuyersByProperty");
const getAllBuyers = require("./controllers/agent/property/buyers/getAllBuyers");
const addAmenityByAgent = require("./controllers/agent/amenity/addAmenity");
//middlewares imports
const agentAuthMiddleware = require("./middlewares/agent.auth.md");
const userAuthMiddleware = require("./middlewares/user.auth.md");
const generalAuthMiddleware = require("./middlewares/general.auth.md");
const adminAuthMiddleware = require("./middlewares/admin.auth.md");
const getPropertiesByFeature = require("./controllers/property/getPropertiesByFeature");
const getCurrentAgent = require("./controllers/agent/authenticate/getCurrentAgent");
const getCurrentAdmin = require("./controllers/admin/authenticate/getCurrentAdmin");
const getAllAmenities = require("./controllers/agent/amenity/getAllAmenities");
const saveProperty = require("./controllers/user/property/saveProperty");
const addLead = require("./controllers/admin/leads/addLead");
const getAllLeads = require("./controllers/admin/leads/getAllLeads");
const changeLead = require("./controllers/admin/leads/changeLead");
const assignNewAgent = require("./controllers/admin/agent/assignNewAgent");
const addTicket = require("./controllers/ticket/addTicket");
const getAllTickets = require("./controllers/ticket/getAllTickets");
const changeTicketStatus = require("./controllers/ticket/changeTicketStatus");
const getTicketByUserId = require("./controllers/ticket/getTicketByUserId");
const addPlan = require("./controllers/plan/addPlan");
const getAllPlans = require("./controllers/plan/getAllPlans");
const buyPlan = require("./controllers/plan/buyPlan");
const createNewUser = require("./controllers/user/createNewUser");
const increaseLeadCount = require("./controllers/admin/leads/increaseLeadCount");
const postBlog = require("./controllers/admin/blogs/postBlog");
const getAllBlogs = require("./controllers/admin/blogs/getAllBlogs");
const deleteBlog = require("./controllers/admin/blogs/deleteBlog");
const editBlog = require("./controllers/admin/blogs/editBlog");
const addNotification = require("./controllers/agent/property/addNotification");
const getPropertiesByAllFilters = require("./controllers/property/getPropertiesByAllFilters");
const getNotificationsByAgentId = require("./controllers/agent/property/getNotificationsByAgentId");
const addPropertyByAdmin = require("./controllers/admin/property/addPropertyByAdmin");
const getAllPremiumUsers = require("./controllers/admin/users/getAllPremiumUsers");
const getUserById = require("./controllers/admin/users/getUserById");
const editUserById = require("./controllers/admin/users/editUserById");
const otpSignup = require("./controllers/user/otp authenticate/otpSignup");
const otpLogin = require("./controllers/user/otp authenticate/otpLogin");
const verifyLoginOTP = require("./controllers/user/otp authenticate/verifyLoginOTP");
const verifySignupOTP = require("./controllers/user/otp authenticate/verifySignupOTP");
const getAllOrders = require("./controllers/plan/getAllOrders");
const getLeadsByUserId = require("./controllers/admin/leads/getLeadsByUserId");
const editPlan = require("./controllers/plan/editPlan");
const activateDeactivate = require("./controllers/admin/property/changePropertyStatus");
const changePropertyStatus = require("./controllers/admin/property/changePropertyStatus");
const getCountOfAll = require("./controllers/admin/users/getCountOfAll");
const getPropertyOfPremiumAgents = require("./controllers/admin/property/getPropertyOfPremiumAgents");
const deleteLocation = require("./controllers/admin/location/deleteLocation");
const getPlansByUserId = require("./controllers/plan/getPlansByUserId");
const addNewsLetter = require("./controllers/newsletter/addNewsLetter");
const getNewsLetterEmails = require("./controllers/newsletter/getNewsLetterEmails");
const contactDetails = require("./controllers/contact us/contactDetails");
const getAllContactDetails = require("./controllers/contact us/getAllContactDetails");
const changePassword = require("./controllers/admin/authenticate/changePassword");
const requestCareService = require("./controllers/user/property/requestCareService");
const getAllCareServiceRequests = require("./controllers/admin/property/getAllCareServiceRequests");
const changeCareServiceStatus = require("./controllers/admin/property/changeCareServiceStatus");
const myCareServiceProperty = require("./controllers/user/property/myCareServiceProperty");
const editPropertyByAdmin = require("./controllers/admin/property/editPropertyByAdmin");
const addInFavourite = require("./controllers/user/property/addInFavourite");
const getAllFavProperties = require("./controllers/user/property/getAllFavProperties");
const editPlanModel = require("./controllers/plan/editPlanModel");
const getUserDetails = require("./controllers/admin/users/getUserDetails");
const deletePropertyImage = require("./controllers/admin/property/deletePropertyImage");
const getAllPropertiesByAdmin = require("./controllers/admin/property/getAllPropertiesByAdmin");

//.................................................................................
const router = Router();
const mediaFiles = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024, // keep file size < 200 MB
  },
});
const profileFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, //file size < 5MB
});
//..................................................................................
//initial route
router.get("/", (req, res) => {
  res.send("welcome to myPropertyGo!");
});

//admin........................................
//admin authenticate
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
// change admin password
router.post("/admin/changePassword", adminAuthMiddleware, changePassword);
//get all agents

router.get("/admin/agent/getAllAgents", adminAuthMiddleware, adminGetAllAgents);

//get agent properties
router.get(
  "/admin/agent/getAgentProperties",
  adminAuthMiddleware,
  adminGetAgentProperties
);
//get locations
//delete agent
router.delete(
  "/admin/agent/deleteAdmin",
  adminAuthMiddleware,
  adminDeleteAgent
);
//get all users
router.get("/admin/user/getAllUsers", adminAuthMiddleware, adminGetAllUsers);
//delete user
router.delete(
  "/admin/user/deleteUser/:id",
  adminAuthMiddleware,
  adminDeleteUser
);
// get user by id
router.get("/admin/user/getUserById/:id", adminAuthMiddleware, getUserById);
// edit user by id
router.put("/admin/user/editUserById/:id", adminAuthMiddleware, editUserById);
// admin create new users
router.post(
  "/admin/user/createNewUser",
  //  adminAuthMiddleware,
  createNewUser
);
// get all users with premium
router.get(
  "/admin/user/getAllPremiumUsers",
  adminAuthMiddleware,
  getAllPremiumUsers
);

//location routes
router.post(
  "/admin/location/addNewLocation",
  // adminAuthMiddleware,
  // mediaFiles.fields([{ name: "photos", maxCount: 30 }]),
  adminAddNewLocation
);
// delete location
router.delete("/admin/deleteLocation/:id", adminAuthMiddleware, deleteLocation);
//add new area
router.post("/admin/location/addNewArea", adminAuthMiddleware, adminAddNewArea);

//update featured to true
router.put("/admin/createFeatured", adminAuthMiddleware, createFeatured);

// add leads in admin
router.post("/leads/addLead", userAuthMiddleware, addLead);
// get all leads by admin
router.get("/admin/leads/getAllLeads", adminAuthMiddleware, getAllLeads);
// change lead by admin
router.post("/admin/leads/changeLead", adminAuthMiddleware, changeLead);
// increase lead count
router.post(
  "/admin/leads/increaseLeadCount",
  // adminAuthMiddleware,
  increaseLeadCount
);
// get lead by user id
router.get("/user/getLeadsByUserId/:id", getLeadsByUserId);
// assigning agent by admin
router.post("/admin/assignNewAgent", adminAuthMiddleware, assignNewAgent);
// admin add property
//property
router.post(
  "/admin/property/addProperty",
  adminAuthMiddleware,
  mediaFiles.fields([
    { name: "photos", maxCount: 30 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  addPropertyByAdmin
);

//user.........................................
//user authenticate
router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
// login by otp
router.post("/user/otpLogin", otpLogin);
// verify login otp
router.post("/user/verifyLoginOTP", verifyLoginOTP);
// send OTP
router.post("/user/otpSignup", otpSignup);
// verify otp
router.post("/user/verifySignupOTP", verifySignupOTP);
//change profile photo
router.patch(
  "/user/profile/changeProfilePhoto",
  userAuthMiddleware,
  profileFile.single("profilePhoto"),
  userChangeProfilePhoto
);
//user contact agent
router.post("/user/property/contactAgent", userAuthMiddleware, contactAgent);
router.post("/user/property/saveProperty", userAuthMiddleware, saveProperty);

//get currently logged in user-

router.get("/currentUser", userAuthMiddleware, getCurrentUser);
//get currently logged in agent-
router.get("/currentAgent", agentAuthMiddleware, getCurrentAgent);
//get currently logged in admin-
router.get("/currentAdmin", adminAuthMiddleware, getCurrentAdmin);

//property.......................................
// get all property
router.get("/property/getAllProperties", getAllProperties);

router.get("/property/getPropertyById/:id", getPropertyById);
//get property by filter
router.get("/property/getPropertyByFilter", getPropertyByFilter);
//get property by location
router.get(
  "/property/getPropertiesByLocation/:locationId",
  getPropertiesByLocation
);

//get properties by property type:-
router.get("/property/getPropertiesByType", getPropertiesByType);
//get property by area
router.get("/property/getPropertiesByArea", getPropertiesByArea);
// get properties by filter
router.get("/property/getPropertiesByFilter", getPropertyByFilter);
// get properties by all filter
router.post("/property/getPropertiesByAllFilters", getPropertiesByAllFilters);

//get properties by featured true
router.get("/property/getPropertiesByFeature", getPropertiesByFeature);
//location routes
router.get("/property/location/getAllLocation", getAllLocation);
//get area in location
router.get("/property/location/getAreaInLocation/:id", getAreaInLocation);

//agent..........................................
//authenticate
router.post("/agent/signup", agentSignup);
router.post("/agent/login", agentLogin);
//change profile photo
router.patch(
  "/agent/profile/changeProfilePhoto",
  agentAuthMiddleware,
  profileFile.single("profilePhoto"),
  agentChangeProfilePhoto
);
//get agent properties
router.get("/user/property", userAuthMiddleware, getAgentProperties);
//property
router.post(
  "/agent/property/addProperty",
  userAuthMiddleware,
  mediaFiles.fields([
    { name: "photos", maxCount: 30 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  addPropertyByAgent
);
// change property status activate or deactivate
router.put(
  "/admin/property/changePropertyStatus",
  adminAuthMiddleware,
  changePropertyStatus
);
//delete property
router.delete(
  "/agent/property/deleteProperty",
  agentAuthMiddleware,
  deletePropertyByAgent
);
//edit property details
router.post(
  "/agent/property/editProperty",
  mediaFiles.fields([
    { name: "photos", maxCount: 30 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  editPropertyByAgent
);
// edit property by admin
router.post(
  "/admin/property/editPropertyByAdmin",
  mediaFiles.fields([
    { name: "photos", maxCount: 30 },
    { name: "primaryImage", maxCount: 1 },
  ]),
  editPropertyByAdmin
);
//add image to a property
router.patch(
  "/agent/property/addImageToProperty",
  agentAuthMiddleware,
  mediaFiles.array("photos", 30),
  addImageToProperty
);

//add image to location:--
router.patch(
  "/agent/property/addImageToLocation",
  // agentAuthMiddleware,
  mediaFiles.array("photos", 30),
  addImageToLocation
);
//delete image from a property
router.delete(
  "/agent/property/deleteImageFromProperty",
  agentAuthMiddleware,
  deleteImageFromProperty
);
//get all buyers for agent
router.get(
  "/agent/property/buyers/getAllBuyers",
  agentAuthMiddleware,
  getAllBuyers
);
//buyers
router.get(
  "/agent/property/buyers/getPropertiesWithBuyers",
  agentAuthMiddleware,
  getPropertiesWithBuyers
);
//buyers by property _id
router.get(
  "/agent/property/buyers/getBuyersByProperty",
  agentAuthMiddleware,
  getBuyersByProperty
);
//add amenities
router.post(
  "/agent/amenity/addAmenity",
  agentAuthMiddleware,
  addAmenityByAgent
);
//get all amenities
router.get("/getAllAmenities", getAllAmenities);

// ........ticket apis.........
// add ticket
router.post("/user/ticket/addTicket", userAuthMiddleware, addTicket);
// get All Tickets by admin
router.get("/admin/ticket/getAllTickets", getAllTickets);
// get tickets by user ID
router.get("/user/ticket/getTicketByUserId/:userId", getTicketByUserId);
// change ticket status by admin
router.post(
  "/admin/ticket/changeTicketStatus",
  adminAuthMiddleware,
  changeTicketStatus
);

// ........ticket apis.........

// ........plans api........
// add plan
router.post("/admin/plan/addPlan", addPlan);
// get plan
router.get("/user/plan/getAllPlans", getAllPlans);
// buy plan
router.post(
  "/user/plan/buyPlan",
  userAuthMiddleware,
  mediaFiles.array("photos", 30),
  buyPlan
);
// get plan by user id
router.get("/user/getPlansByUserId", userAuthMiddleware, getPlansByUserId);
// get all orders by admin
router.get("/admin/getAllOrders", adminAuthMiddleware, getAllOrders);
// edit paid field
router.put("/admin/editPlanElement", adminAuthMiddleware, editPlan);
// edit plan model
router.put("/admin/editPlanModel", editPlanModel);
// ........plans api........

// ........blogs API........
// post blog
router.post("/admin/blog/postBlog", mediaFiles.array("photos", 30), postBlog);
// getAllBlogs By User
router.get("/user/blog/getAllBlogs", getAllBlogs);
// delete blog by id
router.delete("/admin/blog/deleteBlog/:id", adminAuthMiddleware, deleteBlog);
// edit blog by id
router.put("/admin/blog/editBlog", adminAuthMiddleware, editBlog);
// ........blogs API........

// .....notification.....
// add notification
router.post(
  "/agent/notification/addNotification",
  userAuthMiddleware,
  addNotification
);
// get notification by agentId
router.get(
  "/agent/notification/getNotificationsByAgentId/:id",
  getNotificationsByAgentId
);

// get all count details
router.get("/admin/getCountOfAll", adminAuthMiddleware, getCountOfAll);
// get all properties of premium agents
router.get("/property/getPropertyOfPremiumAgents", getPropertyOfPremiumAgents);

// news letter apis
// add email in newsletter
router.post("/user/addNewsLetter", addNewsLetter);
// get all email from newsletter
router.get("/user/getAllNewsLetterEmails", getNewsLetterEmails);

// contact us apis
// submit contact form
router.post("/user/contactDetails", contactDetails);
// get all contact details
router.get(
  "/admin/getAllContactDetails",
  adminAuthMiddleware,
  getAllContactDetails
);

// care services api
// request for care service
router.post("/user/requestCareService", userAuthMiddleware, requestCareService);
// get my care service property
router.get(
  "/user/myCareServiceProperty",
  userAuthMiddleware,
  myCareServiceProperty
);
// get all care service requests by admin
router.get(
  "/admin/getAllCareServiceRequests",
  adminAuthMiddleware,
  getAllCareServiceRequests
);
// admin change careService boolean
router.post(
  "/admin/changeCareServiceStatus",
  // adminAuthMiddleware,
  changeCareServiceStatus
);

// add favourite property
router.post("/user/addInFavourite", userAuthMiddleware, addInFavourite);
// get favourite properties
router.get(
  "/user/getAllFavProperties",
  userAuthMiddleware,
  getAllFavProperties
);
// get user details
router.get("/user/getUserDetails", userAuthMiddleware, getUserDetails);
// delete photo from property
router.post("/admin/deletePropertyImage", deletePropertyImage);
// get all properties by admin
router.get("/admin/getAllPropertiesByAdmin", getAllPropertiesByAdmin);

//.................................................................................
module.exports = router;
