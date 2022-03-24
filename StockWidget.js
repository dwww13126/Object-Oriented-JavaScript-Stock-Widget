/*
* Constructor function for a StockWidget instance.
*
* containerElement : a DOM element inside which the widget will place its UI
*
*/

function StockWidget(containerElement){
	//declare the data properties of the object

  //Array of the company names which are taken from the database, Is used to be able
  //to populate the dropDownStockList for the user to request the most up to date data
  var stockDropdownNames = [];
  //Allows for the user selected stocks to be stored, these will be created or updated by
  //an AJAX request to the database when the user selects a company from the dropDownStockList
  var selectedStockLines = [];
  //Is used to be able to set the sort order which the stockLines use
  //to either be Company (0) or Price (1), By default is company
  var stockSort = 0;
  //Keeps track of the state for the company and price ordering
  //Descending (true) or Ascending (false), By default is Descending
  var companyOrdering = true;
  var priceOrdering = true;
	//declare an inner object literal to represent the widget's UI
  var sortByCompanyButton;
  var sortByPriceButton;
  var stockListLabel;
  var companyRadioLabel;
  var priceRadioLabel;
  //Is used to be able to hold all the different header rows
  var selectRow;
  var sortButtonRow;
  var headerRow;
  //Is used to space out the header text to be the same as the stock lines
  var companyHeaderSpan;
  var priceHeaderSpan;
  var changeHeaderSpan;
  //Is the DIV from the HTML which is passed into to hold the widget
  var widgetContainer;
  //Is the DIV used for holding the stockLines
  var stockLineContiner;

  //Is called to create the instance of the StockWidget in the containerElement
  var createUI = function(containerElement){
      //Creates each of the different DOM ellements and assigns the atributes and
      //data requred to create what is needed to be added to the containerElement
      container = containerElement;
      //Setup the contents of the stock list and label
      dropDownStockList = document.createElement("select");
      dropDownStockList.setAttribute("id", "stockDropdown");
      stockListLabel = document.createElement("label");
      stockListLabel.setAttribute("for", "stockDropdown");
      stockListLabel.innerHTML = "Select Company:";
      //Sets up the headers for the displayed stocklines
      companyHeaderSpan = document.createElement("span");
      priceHeaderSpan = document.createElement("span");
      changeHeaderSpan = document.createElement("span");
      //Sets up the text contained in the header elements
      companyHeaderSpan.innerHTML = "Company";
      priceHeaderSpan.innerHTML = "Price";
      changeHeaderSpan.innerHTML = "+/-";
      //Allows for the spacing to be consistant throughout all rows and headers
      companyHeaderSpan.setAttribute("class", "companySpacing");
      priceHeaderSpan.setAttribute("class", "priceSpacing");
      changeHeaderSpan.setAttribute("class", "changeSpacing");
      //Sets up the company radio button and label
      sortByCompanyButton = document.createElement("button");
      sortByCompanyButton.innerHTML = ("&darr;");
      sortByCompanyButton.setAttribute("id", "companyB");
      sortByCompanyButton.setAttribute("name", "sort");
      //Sets company to be active by default
      sortByCompanyButton.setAttribute("class", "active");
      //adds an event Listener to change the sort order
      sortByCompanyButton.addEventListener("click", function() {
          //Checks the prevous version of stockSort to see it needs to
          //change the ordering (Was already sorted by Price), otherwise
          //retains the prevous ordering (Was prevously sorted by Company)
          if (stockSort == 0){
            priceOrdering = !priceOrdering;
            //alters the text of the button to the corresponding arrow
            if(priceOrdering){
              this.innerHTML = ("&darr;");
            }
            else{
              this.innerHTML = ("&uarr;");
            }
          }
          //Sets its class to be active, and the oposite button to be nonActive
          this.setAttribute("class", "active");
          document.getElementById("priceB").setAttribute("class", "nonActive");
          stockSort = 0;
          updateSelection();
      });
      //Sets up the label for the company sort radio button
      companyRadioLabel = document.createElement("label");
      companyRadioLabel.setAttribute("for", "companyB");
      companyRadioLabel.innerHTML = "Sort By: Company ";
      //Sets up the price radio button and label
      sortByPriceButton = document.createElement("button");
      sortByPriceButton.innerHTML = ("&darr;");
      sortByPriceButton.setAttribute("id", "priceB");
      sortByPriceButton.setAttribute("name", "sort");
      priceRadioLabel = document.createElement("label");
      priceRadioLabel.setAttribute("for", "priceB");
      priceRadioLabel.innerHTML = " Price";
      //Sets company to be nonActive by default
      sortByPriceButton.setAttribute("class", "nonActive");
      //adds an event Listener to change the sort order
      sortByPriceButton.addEventListener("click", function() {
        //Checks the prevous version of stockSort to see it needs to
        //change the ordering (Was already sorted by Price), otherwise
        //retains the prevous ordering (Was prevously sorted by Company)
        if (stockSort == 1){
          companyOrdering = !companyOrdering;
          //alters the text of the button to the corresponding arrow
          if(companyOrdering){
            this.innerHTML = ("&darr;");
          }
          else{
            this.innerHTML = ("&uarr;");
          }
        }
        //Sets its class to be active, and the oposite button to be nonActive
        this.setAttribute("class", "active");
        document.getElementById("companyB").setAttribute("class", "nonActive");
        stockSort = 1;
        updateSelection();
      });
      //Creates a button for setting the sorting order direction

      //Creates the DIVs for storing the different sections of the Widget
      selectRow = document.createElement("div");
      sortButtonRow = document.createElement("div");
      headerRow = document.createElement("div");
      //Allows for top row divs to be bold through the class sellector
      selectRow.setAttribute("class", "label");
      sortButtonRow.setAttribute("class", "label");
      headerRow.setAttribute("class", "label");
      //Appends the required data to the relivent DIVs
      selectRow.appendChild(stockListLabel);
      selectRow.appendChild(dropDownStockList);
      sortButtonRow.appendChild(companyRadioLabel);
      sortButtonRow.appendChild(sortByCompanyButton);
      sortButtonRow.appendChild(priceRadioLabel);
      sortButtonRow.appendChild(sortByPriceButton);
      headerRow.appendChild(companyHeaderSpan);
      headerRow.appendChild(priceHeaderSpan);
      headerRow.appendChild(changeHeaderSpan);
      //Appends everything to the passed in containerElement
      container.appendChild(selectRow);
      container.appendChild(sortButtonRow);
      container.appendChild(headerRow);
      //Creates the div which is used to be able to contain the stockLines that the user selects
      stockLineContiner = document.createElement("div");
      stockLineContiner.setAttribute("class", "stockLinesContainer");
      container.appendChild(stockLineContiner);
  }

  //Allows for a AJAX methoid to be re-used by multiple calls by passing in the infomation required
  function ajaxRequest(method, url, data, callback, err) {
      //XMLHttpRequest Object required for setting up the AJAX request
      let request = new XMLHttpRequest();
      request.open(method, url, true);
      if(method == "POST") {
          request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      }
      request.send(data);
      request.onreadystatechange = function() {
          if (request.readyState == 4) {
              if (request.status == 200) {
                  let response = request.responseText;
                  callback(response);
              } else {
                  err(response.statusText);
              }
          }
      }
  }

  //Is an error function which is used to be able to display an error to the user
  //through the use of a popup alert
  function showErrorPopup(errorMessageT) {
    alert(errorMessageT);
  }

  //Is a method which is used to be able to update the widget when the user selected
  //companys change or the sort order is changed
    function updateSelection() {
    //Clears the stockLineContiner of all stock line elements
    while(stockLineContiner.hasChildNodes()){
      stockLineContiner.removeChild(stockLineContiner.lastChild);
    }
    //Sorts the stocks as defined by the sort order selected from the radio button
    if (stockSort == 0){
      selectedStockLines.sort(companySort);
    }
    else {
      selectedStockLines.sort(priceSort);
    }
    //Once sorted append all the stock lines Dom Ellements into the stockline container
    for(var i = 0; i < selectedStockLines.length; i++){
      var sLine = selectedStockLines[i];
      stockLineContiner.appendChild(sLine.getDomElement());
    }
  }

  //Is used to be able to call the ajaxRequest method to request the
  //names of all the company stocks the database has
  function startWidget() {
    //sets up the url, method and data being sent
    let method = "POST";
    let url = "http://localhost/StockWidget/initialStocks.php";
    let data = "";
    //Calls the ajaxRequest js method using the relivent data
    ajaxRequest(method, url, data, showStocks, showErrorPopup);
  }

  //Is the callback function used to be able to populate the dropdown
  // with all the possible company names that a user is able to monitor stocks for
  function showStocks(responseT) {
    //parses the responce as JSON
    let stocks = JSON.parse(responseT);
    //If the response is "-1" representing that the database does not hold the
    //stocks, update the widget to let them know that there is no stock information
    //on the db
    if (stocks.stocksFound == "-1"){
      //Constructs a new stockLine using the parmeters
      var s1 = "Infomation Not Avalible";
      //Adds to the dropdown list
      stockDropdownNames.push(s1);
    }
    //Otherwise stocks were sucessfully recorded from the database and will be
    //added to the stock widget
    else {
      //Constructs a new "Blank" name to allow for the company names to be underneath
      var s1 = "";
      //Adds to the array of stock lines which the user can chose from
      stockDropdownNames.push(s1);
      //For each of the stocks in the responce JSON add them to the stock dropdown options
      for (let i = 0; i < stocks.Companys.length; i++) {
          //Adds to the array of stock lines which the user can chose from
          stockDropdownNames.push(stocks.Companys[i]);
      }
    }
    //For each of the values in the stockLines array add them to the dropDownStockList
    var select = document.getElementById("stockDropdown");
    for(var i = 0; i < stockDropdownNames.length; i++) {
        var stockName = stockDropdownNames[i];
        //Sets the option up to have the stock name and the index as value
        var option = document.createElement("option");
        option.textContent = stockName;
        //Is the value which is used to be able to idetify the index to the stockDropdownNames list
        option.value = i;
        //Appends the option to the dropdown
        select.appendChild(option);
    }
    //Adds a listener to the stockDropdown to allow for users to select a company
    // from the dropdown and this will be used to call the AJAX to request the
    // latsest infomation from the Database
    select.addEventListener("change", addSelected);

    //Is a function which is used to be able to select a value from the
    function addSelected() {
      var selected = document.getElementById("stockDropdown");
      //Finds if the user has selected a company from the drop down or a "Empty" or "Infomation Not Avalible"
      //option
      var sIndex = selected.selectedIndex;
      //Goes back to the "Blank" option once the sellected index is saved
      selected.selectedIndex = 0;
      //if not "Empty" or "Infomation Not Avalible" index then
      if (sIndex != 0){
        //finds the associated stock line from the stockline array
        var stockLineCompanyName = stockDropdownNames[sIndex];
        //Calls a AJAX methoid to allow for the latest data to be pulled from the database
        readStockData(stockLineCompanyName);
      }
    }
  }

  //Is used to be able to call the ajaxRequest methoid and passes it the relivent
  //parmeters to be able to reveive the possible required values which a user is
  //monitoring, takes in the name of the stock that the user clicks to send to
  //the database
  function readStockData(companyName) {
    let method = "POST";
    let url = "http://localhost/StockWidget/readStockData.php";
    //Sets data to be the passed in company name
    let data = "companyName=" +  companyName;
    //Calls the ajaxRequest js method using the relivent data
    ajaxRequest(method, url, data, addStockData, showErrorPopup);
  }

  //Adds or updates a stockline in selectedStockLines to use the latest data
  // received from the database
  function addStockData(responseT) {
    //parses the responce as JSON
    let stocks = JSON.parse(responseT);
    //If the response is "-1" representing that the database does not hold the
    //requested stock, give a popup to let them know the company selected is no longer
    //held on the database
    if (stocks.stockFound == "-1"){
      alert("Selected Company is not currently held on the database");
    }
    //Otherwise stocks were sucessfully recorded from the database and will be
    //added to the selectedStockLines
    else {
        //Constructs a new stockLine using the parmeters received from the DB
        var s1 = new StockLine(stocks.Company, stocks.Price, stocks.MovementAmount);
        //Checks to see if there is already a stock line which features the same
        //values so that it can update the information of an exisiting stockLine
        var foundExsisting = false;
        //Stores the index of an ensisting stock line if found
        var foundIndex = 0;
        //Goes through a for loop which sets foundExsisting and exits the loop if
        //an exsisting match is found
        for(var i = 0; i < selectedStockLines.length; i++) {
            if (selectedStockLines[i].getCompany() == stocks.Company) {
                foundExsisting = true;
                break;
            }
            //Increments found index
            foundIndex++;
        }
        //Uses the result of found to know if a match was found
        if(foundExsisting){
          //Assigns the  new stockLine to the found index
          selectedStockLines[foundIndex] = s1;
        }
        //otherwise no watch was found and stockLine has not pervously been selected by the user
        else {
          //Adds to the array of sellected stock lines
          selectedStockLines.push(s1);
        }
    }
    //Call the method to sort and display what is inside selectedStockLines
    updateSelection();
  }

  //Are the 2 sort methods required to be able to sort in Alphabetical order of company
  //(a first z last with everything put to lower case to prevent comparisons from being
  //effected) and in terms of price (lowest first, highest last)

  //Allows the stocks to be sorted in alphabetical order of the company name
  var companySort = function(s1,s2){
    //Takes the passed in stocks and coverts the company name of the stock and sets
    //them to be lower case
    var s1CNLower = s1.getCompany().toString().toLowerCase();
    var s2CNLower = s2.getCompany().toString().toLowerCase();
    //Compares the lower case company names

    //If the 1st company is after the second company lexicographically
    if (s1CNLower > s2CNLower){
      return 1;
    }
    //else If the 1st company is before the second company lexicographically
    else if (s1CNLower < s2CNLower){
      return -1;
    }
    //else both company names are the same
    else{
      return 0;
    }
  }


  //Allows the stocks to be sorted by order of smallest price to largest price
  var priceSort = function(s1,s2){
    //Takes the passed in stocks and stores the values of the
    var s1Price = parseFloat(s1.getPrice());
    var s2Price = parseFloat(s2.getPrice());
    //Compares the float values with one another

    //If the 1st stock price is greater than the 2nd stock price
    if (s1Price > s2Price){
      return 1;
    }
    //else if the 1st stock price is less than the 2nd stock price
    else if (s1Price < s2Price){
      return -1;
    }
    //else both stock prices are the same
    else{
      return 0;
    }
  }



  //private method to intialise the widget's UI on start up
  var initialise = function(containerElement){
  	createUI(containerElement);
    //Starts the widget by using AJAX to get all the results from the database
    startWidget();
  }
 //Is used to be able to refresh what is shown in the Widget
 var refreshInterface = function() {

  //If stockLineContiner is not initialised (null) then return
  if(stockLineContiner == null){
      return;
  }
  //is used to be able to remove all the stockLines from the DOM
  while(stockLineContiner.hasChildNodes()){
    stockLineContiner.removeChild(stockLineContiner.lastChild);
  }

  //Finds out which sort order is needed depending on the value of the sort
  //int and perfrorms the sort method
  if(sortOrder == 1){
    selectedStockLines.sort(companySort);
  }
  else {
    selectedStockLines.sort(priceSort);
  }
  //For each of the stockLines add them to the stockLine container to be
  //displayed
  for(var i = 0; i < selectedStockLines.length; i++){
    var sLine = selectedStockLines[i];
    stockLineContiner.appendChild(sLine.getDomElement());
  }
 }


  //Constructor Function for the inner StockLine object to hold the
  //Company name, Stock Price and Movement amount
  var StockLine = function(name, price, movement){
  	//declare the data properties for the object and its UI
    var name = name;
    var price = price;
    var movement = movement;
  	//declare an inner object literal to represent the widget's UI
    //Holds all ellements used to create the row spans
    var companyInfoSpan;
    var priceInfoSpan;
    var changeInfoSpan;
    //Is used to be able to store the everything added to the stockLine
    var divEllement;
    //function to create and configure the DOM elements for the UI
    var createInterface = function(){
      //Creates the div ellement which is used to store the row
      divEllement = document.createElement('div');

      //Sets up the required spans to show the stock Infomation
      //and puts the passed in name, price and change
      companyInfoSpan = document.createElement('span');
      companyInfoSpan.innerHTML = name;
      priceInfoSpan = document.createElement('span');
      priceInfoSpan.innerHTML = price;
      changeInfoSpan = document.createElement('span');
      changeInfoSpan.innerHTML = movement;
      //Allows for the spacing to be consistant throughout all rows and headers
      companyInfoSpan.setAttribute("class", "companySpacing");
      priceInfoSpan.setAttribute("class", "priceSpacing");
      changeInfoSpan.setAttribute("class", "changeSpacing");
      //Appends the required spans to the divEllement
      divEllement.appendChild(companyInfoSpan);
      divEllement.appendChild(priceInfoSpan);
      divEllement.appendChild(changeInfoSpan);
    }

    //returns the dom ellement which holds the created row,
  	this.getDomElement = function(){
  		return divEllement;
  	}
    //ALlows for the private values to be returned to use for comparisions
    this.getCompany = function(){
      return name;
    }
    this.getPrice = function(){
      return parseFloat(price);
    }
    this.getMovement = function(){
      return parseFloat(movement);
    }

  	//createInterface() method is called when the object is instantiated
  	createInterface();

  };
  // initialise method is called when a StockWidget object is initialised
   initialise(containerElement);
 }
