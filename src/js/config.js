/* many real world applications have two special modules that are completely independent of the rest of the architectures and these modules are for project configuration and some general helper functions that are useful across the entire project, so we create a new file for configuration called 'config' and for helper functions we create 'helpers' */

/* in this file we will basically put all the variables that should be constants and reused across the project and the goal of having this file is that it will allow us to easily configure our project by simply changing some of the data that is here in this file, but those variables can be put at the top in each module files but then we will have all those configuration variables spread across multiple module files but it is easier to simply have them in one file */

/* the only variables that we want here are the ones that are responsible for defining some important data about the application itself such as the API, we reuse it multiple times in multiple places for getting search data and uploading a recipe to server, so all of these functionalities will use this API but at some point if it changes because of version or any other reason then we don't want going into our code and changing it at all the places it was placed that would be too much work */

// variable that contains the API
export const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes/";

/* when we put 10 there it could come of as a magic number/value which is a value that appears out of nowhere, so if someone were to read code they would have not understood what that number is, so this makes it a perfect candidate for a configuration value, and this is something we might change later on in our application */
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 12;
export const KEY = "7f7aa5d2-db1b-4496-8147-1e10fc274051";
export const MODAL_CLOSE_SEC = 0.6;
export const FORM_OPEN_AGAIN = 1.1;
