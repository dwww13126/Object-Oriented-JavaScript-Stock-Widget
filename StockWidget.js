/*
* Constructor function for a StockWidget instance.
*
* container_element : a DOM element inside which the widget will place its UI
*
*/

function StockWidget(container_element){
	//declare the data properties of the object

  //Array of the company names which are taken from the database, Is used to be able
  //to populate the dropDownStockList for the user to request the most up to date data
  var _stockDropdownNames = [];
  //Allows for the user selected stocks to be stored, these will be created or updated by
  //an AJAX request to the database when the user selects a company from the dropDownStockList
  var _selectedStockLines = [];
  //Is used to be able to set the sort order which the stockLines use
  //to either be Company (0) or Price (1), By default is company
  var _stockSort = 0;
	//declare an inner object literal to represent the widget's UI
  var _sortByCompanyRadio;
  var _sortByPriceRadio;
  var _stockListLabel;
  var _companyRadioLabel;
  var _priceRadioLabel;
  //Is used to be able to hold all the different header rows
  var _selectRow;
  var _sortButtonRow;
  var _headerRow;
  //Is used to space out the header text to be the same as the stock lines
  var _companyHeaderSpan;
  var _priceHeaderSpan;
  var _changeHeaderSpan;
  //Is the DIV from the HTML which is passed into to hold the widget
  var _widgetContainer;
  //Is the DIV used for holding the stockLines
  var _stockLineContiner;

  //Is called to create the instance of the StockWidget in the container_element
  var _createUI = function(container_element){
      //Creates each of the different DOM ellements and assigns the atributes and
      //data requred to create what is needed to be added to the container_element
      _container = container_element;
      //Setup the contents of the stock list and label
      _dropDownStockList = document.createElement("select");
      _dropDownStockList.setAttribute("id", "stockDropdown");
      _stockListLabel = document.createElement("label");
      _stockListLabel.setAttribute("for", "stockDropdown");
      _stockListLabel.innerHTML = "Select Company:";
      //Sets up the headers for the displayed stocklines
      _companyHeaderSpan = document.createElement("span");
      _priceHeaderSpan = document.createElement("span");
      _changeHeaderSpan = document.createElement("span");
      //Sets up the text contained in the header elements
      _companyHeaderSpan.innerHTML = "Company";
      _priceHeaderSpan.innerHTML = "Price";
      _changeHeaderSpan.innerHTML = "+/-";
      //Allows for the spacing to be consistant throughout all rows and headers
      _companyHeaderSpan.setAttribute("class", "companySpacing");
      _priceHeaderSpan.setAttribute("class", "priceSpacing");
      _changeHeaderSpan.setAttribute("class", "changeSpacing");
      //Sets up the company radio button and label
      _sortByCompanyRadio = document.createElement("INPUT");
      _sortByCompanyRadio.setAttribute("type", "radio");
      _sortByCompanyRadio.setAttribute("id", "companyB");
      _sortByCompanyRadio.setAttribute("name", "sort");
      //Sets company to be checked by default on page load
      _sortByCompanyRadio.setAttribute("checked", " ");
      //adds an event Listener to change the sort order and update the order if selected
      _sortByCompanyRadio.addEventListener( "change", function() {
          if(this.checked) {
              _stockSort = 0;
          }
          else {
              _stockSort = 1;
          }
          updateSelection();
      });
      //Sets up the label for the company sort radio button
      _companyRadioLabel = document.createElement("label");
      _companyRadioLabel.setAttribute("for", "companyB");
      _companyRadioLabel.innerHTML = "Sort By: Company";
      //Sets up the price radio button and label
      _sortByPriceRadio = document.createElement("INPUT");
      _sortByPriceRadio.setAttribute("type", "radio");
      _sortByPriceRadio.setAttribute("id", "priceB");
      _sortByPriceRadio.setAttribute("name", "sort");
      _priceRadioLabel = document.createElement("label");
      _priceRadioLabel.setAttribute("for", "priceB");
      _priceRadioLabel.innerHTML = " Price";
      _sortByPriceRadio.addEventListener("change", function() {
          if(this.checked) {
              _stockSort = 1;
          }
          else {
              _stockSort = 0;
          }
          updateSelection();
      });
      //Creates the DIVs for storing the different sections of the Widget
      _selectRow = document.createElement("div");
      _sortButtonRow = document.createElement("div");
      _headerRow = document.createElement("div");
      //Allows for top row divs to be coloured light yellow through the class sellector
      _selectRow.setAttribute("class", "highlight");
      _sortButtonRow.setAttribute("class", "highlight");
      _headerRow.setAttribute("class", "highlight");
      //Appends the required data to the relivent DIVs
      _selectRow.appendChild(_stockListLabel);
      _selectRow.appendChild(_dropDownStockList);
      _sortButtonRow.appendChild(_companyRadioLabel);
      _sortButtonRow.appendChild(_sortByCompanyRadio);
      _sortButtonRow.appendChild(_priceRadioLabel);
      _sortButtonRow.appendChild(_sortByPriceRadio);
      _headerRow.appendChild(_companyHeaderSpan);
      _headerRow.appendChild(_priceHeaderSpan);
      _headerRow.appendChild(_changeHeaderSpan);
      //Appends everything to the passed in container_element
      _container.appendChild(_selectRow);
      _container.appendChild(_sortButtonRow);
      _container.appendChild(_headerRow);
      //Creates the div which is used to be able to contain the stockLines that the user selects
      _stockLineContiner = document.createElement("div");
      _stockLineContiner.setAttribute("class", "stockLinesContainer");
      _container.appendChild(_stockLineContiner);
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
    //Clears the _stockLineContiner of all stock line elements
    while(_stockLineContiner.hasChildNodes()){
      _stockLineContiner.removeChild(_stockLineContiner.lastChild);
    }
    //Sorts the stocks as defined by the sort order selected from the radio button
    if (_stockSort == 0){
      _selectedStockLines.sort(_companySort);
    }
    else {
      _selectedStockLines.sort(_priceSort);
    }
    //Once sorted append all the stock lines Dom Ellements into the stockline container
    for(var i = 0; i < _selectedStockLines.length; i++){
      var sLine = _selectedStockLines[i];
      _stockLineContiner.appendChild(sLine.getDomElement());
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
      _stockDropdownNames.push(s1);
    }
    //Otherwise stocks were sucessfully recorded from the database and will be
    //added to the stock widget
    else {
      //Constructs a new "Blank" name to allow for the company names to be underneath
      var s1 = "";
      //Adds to the array of stock lines which the user can chose from
      _stockDropdownNames.push(s1);
      //For each of the stocks in the responce JSON add them to the stock dropdown options
      for (let i = 0; i < stocks.Companys.length; i++) {
          //Adds to the array of stock lines which the user can chose from
          _stockDropdownNames.push(stocks.Companys[i]);
      }
    }
    //For each of the values in the stockLines array add them to the dropDownStockList
    var select = document.getElementById("stockDropdown");
    for(var i = 0; i < _stockDropdownNames.length; i++) {
        var stockName = _stockDropdownNames[i];
        //Sets the option up to have the stock name and the index as value
        var option = document.createElement("option");
        option.textContent = stockName;
        //Is the value which is used to be able to idetify the index to the _stockDropdownNames list
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
        var stockLineCompanyName = _stockDropdownNames[sIndex];
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

  //Adds or updates a stockline in _selectedStockLines to use the latest data
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
    //added to the _selectedStockLines
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
        for(var i = 0; i < _selectedStockLines.length; i++) {
            if (_selectedStockLines[i].getCompany() == stocks.Company) {
                foundExsisting = true;
                break;
            }
            //Increments found index
            foundIndex++;
        }
        //Uses the result of found to know if a match was found
        if(foundExsisting){
          //Assigns the  new stockLine to the found index
          _selectedStockLines[foundIndex] = s1;
        }
        //otherwise no watch was found and stockLine has not pervously been selected by the user
        else {
          //Adds to the array of sellected stock lines
          _selectedStockLines.push(s1);
        }
    }
    //Call the method to sort and display what is inside _selectedStockLines
    updateSelection();
  }

  //Are the 2 sort methods required to be able to sort in Alphabetical order of company
  //(a first z last with everything put to lower case to prevent comparisons from being
  //effected) and in terms of price (lowest first, highest last)

  //Allows the stocks to be sorted in alphabetical order of the company name
  var _companySort = function(s1,s2){
    //Takes the passed in stocks and coverts the company name of the stock and sets
    //them to be lower case
    var _s1CNLower = s1.getCompany().toString().toLowerCase();
    var _s2CNLower = s2.getCompany().toString().toLowerCase();
    //Compares the lower case company names

    //If the 1st company is after the second company lexicographically
    if (_s1CNLower > _s2CNLower){
      return 1;
    }
    //else If the 1st company is before the second company lexicographically
    else if (_s1CNLower < _s2CNLower){
      return -1;
    }
    //else both company names are the same
    else{
      return 0;
    }
  }


  //Allows the stocks to be sorted by order of smallest price to largest price
  var _priceSort = function(s1,s2){
    //Takes the passed in stocks and stores the values of the
    var _s1Price = parseFloat(s1.getPrice());
    var _s2Price = parseFloat(s2.getPrice());
    //Compares the float values with one another

    //If the 1st stock price is greater than the 2nd stock price
    if (_s1Price > _s2Price){
      return 1;
    }
    //else if the 1st stock price is less than the 2nd stock price
    else if (_s1Price < _s2Price){
      return -1;
    }
    //else both stock prices are the same
    else{
      return 0;
    }
  }



  //private method to intialise the widget's UI on start up
  var _initialise = function(container_element){
  	_createUI(container_element);
    //Starts the widget by using AJAX to get all the results from the database
    startWidget();
  }
 //Is used to be able to refresh what is shown in the Widget
 var _refreshInterface = function() {

  //If _stockLineContiner is not initialised (null) then return
  if(_stockLineContiner == null){
      return;
  }
  //is used to be able to remove all the stockLines from the DOM
  while(_stockLineContiner.hasChildNodes()){
    _stockLineContiner.removeChild(_stockLineContiner.lastChild);
  }

  //Finds out which sort order is needed depending on the value of the sort
  //int and perfrorms the sort method
  if(_sortOrder == 1){
    _selectedStockLines.sort(_companySort);
  }
  else {
    _selectedStockLines.sort(_priceSort);
  }
  //For each of the stockLines add them to the stockLine container to be
  //displayed
  for(var i = 0; i < _selectedStockLines.length; i++){
    var sLine = _selectedStockLines[i];
    _stockLineContiner.appendChild(sLine.getDomElement());
  }
 }


  //Constructor Function for the inner StockLine object to hold the
  //Company name, Stock Price and Movement amount
  var StockLine = function(name, price, movement){
  	//declare the data properties for the object and its UI
    var _name = name;
    var _price = price;
    var _movement = movement;
  	//declare an inner object literal to represent the widget's UI
    //Holds all ellements used to create the row spans
    var _companyInfoSpan;
    var _priceInfoSpan;
    var _changeInfoSpan;
    //Is used to be able to store the everything added to the stockLine
    var _divEllement;
    //function to create and configure the DOM elements for the UI
    var _createInterface = function(){
      //Creates the div ellement which is used to store the row
      _divEllement = document.createElement('div');

      //Sets up the required spans to show the stock Infomation
      //and puts the passed in name, price and change
      _companyInfoSpan = document.createElement('span');
      _companyInfoSpan.innerHTML = _name;
      _priceInfoSpan = document.createElement('span');
      _priceInfoSpan.innerHTML = _price;
      _changeInfoSpan = document.createElement('span');
      _changeInfoSpan.innerHTML = _movement;
      //Allows for the spacing to be consistant throughout all rows and headers
      _companyInfoSpan.setAttribute("class", "companySpacing");
      _priceInfoSpan.setAttribute("class", "priceSpacing");
      _changeInfoSpan.setAttribute("class", "changeSpacing");
      //Appends the required spans to the _divEllement
      _divEllement.appendChild(_companyInfoSpan);
      _divEllement.appendChild(_priceInfoSpan);
      _divEllement.appendChild(_changeInfoSpan);
    }

    //returns the dom ellement which holds the created row,
  	this.getDomElement = function(){
  		return _divEllement;
  	}
    //ALlows for the private values to be returned to use for comparisions
    this.getCompany = function(){
      return _name;
    }
    this.getPrice = function(){
      return parseFloat(_price);
    }
    this.getMovement = function(){
      return parseFloat(_movement);
    }

  	//_createInterface() method is called when the object is instantiated
  	_createInterface();

  };
  // _initialise method is called when a StockWidget object is initialised
   _initialise(container_element);
 }
