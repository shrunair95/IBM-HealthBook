/**

Authors:
  Akash AN, BT Somaiah, Shruti Nair
  9th September'16

*/

var Messages = {
    
};

var wlInitOptions = {
    
};

var cloudantType = "javascript";
var cloudantInstance = new Cloudant(cloudantType);

var message = 'Loading...';
var list = [];
var doc_list = [];
var Appointments_list=[];
var seen = {};
var user = "null";
function wlCommonInit(){
if(checkConnection()==1)
{

    getList();
    getDoctorsList();
    getAppointmentsList();
    clear();



    
$('#register').on('click',function(){

        
        if(checkSignUp() == 1)
        {
            if(checkcred()==1)
            {
            var entry = {'uname': $('#uname').val(), 'pass': $('#pass').val() , 'dob': $('#dob').val(), 'name': $('#name').val() , 'gender': $('#gender').val(), 'email': $('#email').val() };

            cloudantInstance.addEntry(entry).then(
                function(results)
                {
                    user = $('#uname').val();
                    //alert("user = " + user);
                    $('#uname').val('');
                    $('#pass').val('');
                    $('#dob').val('');
                    $('#name').val('');
                    $('#email').val('');
                    
                    navigator.notification.alert("Successfully Registered");
                    $("#page3").show();
                    $("#reg").hide();
                    $('#name_txt').val(entry.name);
                    $('#dob_txt').val(entry.dob);
                    $('#email_txt').val(entry.email);
                    header('Location: http://stackoverflow.com');
                },
                function(results){
                    WL.Logger.debug("addEntry onFailure: " + JSON.stringify(results));
                    navigator.notification.alert("error in add");
                }
            );
            }
            else
            {
                navigator.notification.alert("Password and Confirm Password must match");
            }
        }

        else
        {
            navigator.notification.alert("Please enter all the details");
        }
    });
    

    $('#login').on('click',function()
    {
        getList();
        jQuery.each(list, function(index, value){
            
            if(value.uname == $('#username').val())
            {
                if(value.pass == $('#password').val())
                {
                    user = value.uname;
                    $('#username').val('');
                    $('#password').val('');
                    $("#page3").show();
                    $("#page1").hide();

                    $('#name_txt').val(value.name);
                    $('#dob_txt').val(value.dob);
                    $('#email_txt').val(value.email);
  
        
                }
                else
                {
                    navigator.notification.alert("Wrong Username or password");
                }
            }
        });
    });
    

    $('#search').on('click',function()
    {

        var flag=1;
        getDoctorsList();

        clear();

        if(doc_list.length==0 || doc_list.length<0)
            {
                navigator.notification.alert("No available doctors");
            }
      else{
        $(doc_name).show();
        $(doc_ex).show();
        $('#dat_show').show();
        $('#book').show();
        $('#dateapp').show();
        $('#timeapp').show();
        
        jQuery.each(doc_list, function(index, value)
        {
            if(value.specialization == $('#spec').val())
            {
                $('#results').append('<tr><td>' + value.name +"&emsp;"+"&emsp;"+"&emsp;"+"&nbsp;"+"&nbsp;"+"&nbsp;" + value.experience +"&emsp;"+'</td><td><input id="doctor" type="radio" name="doctor" value="' + value.name +'">'+'<br></td></tr>');
                
                flag=0;
              
               


            }

        });
        if(flag==1)
            nodoc();
    }

    });
    function clear(){
     $("#results").empty();
    }

    function nodoc(){
        $(doc_name).hide();
        $(doc_ex).hide();
        $('#dat_show').hide();
        $('#book').hide();
        $('#dateapp').hide();
        $('#timeapp').hide();
        navigator.notification.alert("No available doctors");
    }

    $('#signup').on('click',function()
    {
       $("#page1").hide();
          $("#reg").show();


    });

    $('#myhistory').on('click',function()
    {
        var flag=1;
        $("#history_list").empty();
        getAppointmentsList();
        if(Appointments_list.length==0)
                alert("No Appointments");
        jQuery.each(Appointments_list, function(index, value)
        {
            
            if(value.user == user)
            { 
                
                $("#history_list").append("<li> " + value.doctor +", &nbsp;"+ value.specialization +"&nbsp;"+"&nbsp;"+ value.date +"&nbsp;"+"&nbsp;"+ value.time +  "</li>");
                $("#page3").hide();
                $("#history").show();
                flag=0;
                
            }
        });
        if(flag==1)
        {
            navigator.notification.alert("No Prior Appointment Bookings");
        }

    });

    $('#bookapp').on('click',function()
    {
       $("#page3").hide();
       $("#page4").show();


    });

    $('#back2').on('click',function()
    {
       $("#page4").hide();
       $("#page3").show();


    });


    $('#back1').on('click',function()
    {
       $("#history").hide();
       $("#page3").show();


    });



    $('#logout1').on('click',function()
    {
       $("#page3").hide();
          $("#page1").show();


    });

    $('#logout2').on('click',function()
    {
       $("#history").hide();
          $("#page1").show();


    });

    $('#logout3').on('click',function()
    {
       $("#page3").hide();
          $("#page1").show();


    });



    $('#book').on('click',function()
    {
        jQuery("input[id=doctor]").each(function(){
            
            if($(this).is(':checked')) 
            { 

                
                 var entry = {'user': user, 'doctor': $(this).val(),'specialization':$('#spec').val(),'date':$('#dateapp').val(),'time':$('#timeapp').val()};
                 cloudantInstance.addAppointment(entry).then(
                    function(results)
                    {
                        
                        alert("Appointment booked");
                        getAppointmentsList();
               
                    },
                    function(results)
                    {
                        WL.Logger.debug("addAppointment onFailure: " + JSON.stringify(results));
                        navigator.notification.alert("error in add");
                    }
                );
            }
        });
        
    });
}
else
{
    navigator.notification.alert("No active internet connection!");
    for(var i=0;i<1000000000;i++);
    navigator.app.exitApp();
}

}  


function checkSignUp()
{
    if($('#uname').val() && $('#pass').val() && $('#cpass').val() && $('#name').val() && $('#dob').val() && $('#email').val() ) 
            return 1;
    else return 0;
}

function checkcred()
{
    if($('#cpass').val()==$('#pass').val())
        return 1;
    else
        return 0;
}

function checkLogin()
{
    if($('#username').val() && $('#password').val() ) 
            return 1;
    else return 0;
}

function getList(){
    window.plugins.spinnerDialog.show();
    cloudantInstance.getAllEntries().then(
        function(results){
            list = results;
            window.plugins.spinnerDialog.hide();
            
        },
        function(results){
            WL.Logger.debug("getAllEntries onFailure: " + JSON.stringify(results));
            alert("error in getList" + JSON.stringify(results));
            window.plugins.spinnerDialog.hide();
        }
    );
}



function getDoctorsList()
{
    window.plugins.spinnerDialog.show();
    cloudantInstance.getAllDocEntries().then(
        function(results)
        {
            doc_list = results;
            
            window.plugins.spinnerDialog.hide();
            
        },
        function(results)
        {
            WL.Logger.debug("getAllEntries onFailure: " + JSON.stringify(results));
            alert("error in getList" + JSON.stringify(results));
            window.plugins.spinnerDialog.hide();
        }
    );
}

function getAppointmentsList()
{
    window.plugins.spinnerDialog.show();
    cloudantInstance.getAllAppointmentEntries().then(
        function(results)
        {
            Appointments_list = results;
            
        
            window.plugins.spinnerDialog.hide();
            
        },
        function(results)
        {
            WL.Logger.debug("getAllEntries onFailure: " + JSON.stringify(results));
            alert("error in getList" + JSON.stringify(results));
            window.plugins.spinnerDialog.hide();
        }
    );
}

function checkConnection() {
    var networkState = navigator.connection.type;

    if(networkState==Connection.NONE)
        return 0;
    return 1;
}



