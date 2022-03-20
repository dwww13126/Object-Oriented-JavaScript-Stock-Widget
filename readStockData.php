
<?php
    require_once('dbConnect.php');
    //Selects all instances of the shares which have the same name as the company requested
    $query = "SELECT * FROM `shareprices` WHERE `name` = '".$_POST['companyName']."'";
   $result = mysqli_query($conn, $query);
   //If there are results present in the shareprices table
   if(mysqli_num_rows($result)!= 0) {
       //Is used to be able to get the stock infomation from the result
       $row = mysqli_fetch_assoc($result);
       //Creates an array for being able to store the stock data that needs
       //to be returned
       $Stocks = array('stockFound' => 1, 'Company' => $row['name'], 'Price' => $row['price'], 'MovementAmount' => $row['movement']);
      //Echos back the stock array encoded in JSON
      echo json_encode($Stocks);
   }
   //If there are no results present in the shareprices table
   else{
     //send back an array with the stockFound being "-1"
     $fail = array('stockFound' => '-1');
     echo json_encode($fail);
   }
 ?>
