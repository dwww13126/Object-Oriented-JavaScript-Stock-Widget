
<?php
   require_once('dbConnect.php');
   //Selects all instances of shares from the database
   $query = "SELECT * FROM `shareprices`";
   $result = mysqli_query($conn, $query);
   //If there are results present in the shareprices table
   if(mysqli_num_rows($result) != 0) {
       //Creates an array for being able to store the stocks data that needs
       //to be returned
       $Stocks = array('stocksFound' => 1, 'Companys' => array(), 'Prices' => array(), 'MovementAmounts' => array());
      //For each of the different stock values found
      while($row = mysqli_fetch_assoc($result))
      {
        //Adds each of the different values to the required arrays in the stocks array
        array_push($Stocks['Companys'], $row['name']);
        array_push($Stocks['Prices'], $row['price']);
        array_push($Stocks['MovementAmounts'], $row['movement']);
      }
      //Echos back the stocks array encoded in JSON
      echo json_encode($Stocks);
   }
   //If there are no results present in the shareprices table
   else{
     //send back an array with the stocksFound being "-1"
     $fail = array('stocksFound' => '-1');
     echo json_encode($fail);
   }
 ?>
