import View from "./views.js";
import previewView from "./preview-view.js";
import icons from "url:../../img/icons.svg";

class ResultView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found for your query! Please try again.";
  _successMessage = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultView();
