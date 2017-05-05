var currentUser="";
var selectedFriend="";
var users;//collection
var messagesOfcurrentDialog;//collection
var userID=0;
var time;
var SaveAndAddUser=function(username,password)
{
  localStorage.setItem(username,password);
};
var getAllUsers=function()
{
  return localStorage.getItem("Myusers");
};
var AddUserToUsers=function(username)
{
  var us=getAllUsers();
  if(us==""||us==null)
  {
    us=[];
    us.push(username);
  }
  else
  {
    us+=','+username;
  }
  localStorage.setItem("Myusers",us);
};
var message=Backbone.Model.extend({
  defaults:{
    messageText: '',
    smile: '',
    linkNotlink: false,
    delNotdel: false,
    modifNotmodif:false,
    color: 'black',
    sentTime: '',
    owner: '',
    receiver: '',
    myChat: ''
  }
});
var mesView=Marionette.View.extend({
    template:'#mesV',
    events: {
 
           }
});
var messagesList = Marionette.CollectionView.extend({
    collection: new Backbone.Collection(),
    childView:  mesView ,
    initialize:function()
	 {
		this.collection.on("change", function(model) {renderMes();});
     }  
});
messagesOfcurrentDialog=new messagesList();
var renderMes=function()
{
  messagesOfcurrentDialog.render();
};
var renderUsers=function()
{
  users.render();
};
var user=Backbone.Model.extend({
  defaults:{
   //id: 0,
   username: 'krot',
   password: 'pass',
   status: 'none',
   OnOff: true,
   lastActive: 'not known yet',
   chatCollection: ''
    }
});
var changeNameAndStat=function()
{   var d=new user(JSON.parse(localStorage.getItem(currentUser)));
  var t=new Date();
  //alert(JSON.stringify(d));
              $('.two').html( '<button id="changeSt">change status</button><p>  </p><button id="exit">exit</button>');
              $('#changeSt').click(function(){var stat=prompt('Please enter new status:');
                
                d.set('status',stat);

              
                localStorage.setItem(currentUser,JSON.stringify(d));}
                );
               $('#exit').click(function(){
        var d=new user(JSON.parse(localStorage.getItem(currentUser))); 
                  d.set('lastActive',t.getHours()+':'+t.getMinutes());
                localStorage.setItem(currentUser,JSON.stringify(d));});
};
var userView=Marionette.View.extend({
    template:'#friends',
    ui:     {
            div: '.f',
            divchik: '.friendName',
            del: '#delChat',
            clear:'#clearChat'
            },
    events: {
             'click @ui.div': function(){  
            $('#allmessages').html(''); 
             messagesOfcurrentDialog.collection.reset();
                  
              selectedFriend=this.ui.divchik.html().trim();
             
            
                 
          var d=new user(JSON.parse(localStorage.getItem(selectedFriend)));
              $('.dialogAbove').html( "Dialog with <b>"+selectedFriend+'</b>  status:'+ d.get('status')+'  was at: '+d.get('lastActive'));

           var chatik=localStorage.getItem(selectedFriend+'N'+currentUser);

               
              if(chatik!=null&&chatik!="")
               {
                uploadListOfMes(chatik); 
               
               }     

             },
               'click @ui.del': function(){
              // alert('ihjhvghc'); 
               var todel=this.ui.divchik.html().trim();
               localStorage.setItem(todel+'N'+currentUser,'');
               localStorage.setItem(currentUser+'N'+todel,'');
               },
               'click @ui.clear': function(){ 
               var todel=this.ui.divchik.html().trim();
               localStorage.setItem(todel+'N'+currentUser,'');
               localStorage.setItem(currentUser+'N'+todel,'');
               }}
});
var usersList = Marionette.CollectionView.extend({
    collection: new Backbone.Collection(),
    childView:  userView ,
    initialize:function()
   {
    this.collection.on("change", function(model) {renderUsers();});
     }  
});
users=new usersList();

var currentChatView=Marionette.View.extend({

    template:'#mainArea',
    ui:     {
             input: '#Text1',
             button: '#sendMessageBut'
            },
    events:{
            'click @ui.button': function(){
              //validate
              //sending actions: 
              time=new Date();
              var newm=new message({messageText:this.ui.input.val(),
                sentTime:time.getHours()+':'+time.getMinutes(),
                 owner:currentUser,receiver:selectedFriend});
              // add it to collection
              
              var chat=localStorage.getItem(selectedFriend+'N'+currentUser);
            
              if(chat!=null&&chat!="")
                {
                  chat+="&,"+JSON.stringify(newm);
                localStorage.setItem(currentUser+'N'+selectedFriend,chat);
                 localStorage.setItem(selectedFriend+'N'+currentUser,chat);
              }
              else
                {
                  var m=[];
                  m.push(JSON.stringify(newm));
                  
                 localStorage.setItem(currentUser+'N'+selectedFriend,m);
                 localStorage.setItem(selectedFriend+'N'+currentUser,m);
                 
                 
                }
              
              messagesOfcurrentDialog.collection.add(newm);
              $('#allmessages').append(messagesOfcurrentDialog.$el);
              messagesOfcurrentDialog.render();
          updateMesList();

             }
           }

});
var uploadListOfMes=function(chatik){
   
      getMesList(chatik);
      $('#allmessages').append(messagesOfcurrentDialog.$el);
       messagesOfcurrentDialog.render();
     
      
};
var getMesList=function(chatik){
 //fchatik=localStorage.getItem(selectedFriend+"N"+createUser);
 if(chatik!=null&&chatik!=""){
 var ms=chatik.split("&,");
 messagesOfcurrentDialog.collection.reset();
  $('#allmessages').html('');
 var e;
 for(var i=0;i<ms.length;i++){  
   var stringToMes=ms[i];

     var s=JSON.parse(stringToMes);

   e=new message(s);
     messagesOfcurrentDialog.collection.add(e);
   }  }

};
 var updateMesList = function()
 {
      setInterval(function(){
   $('#allmessages').html(''); 
             messagesOfcurrentDialog.collection.reset();
                  
             // selectedFriend=this.ui.divchik.html().trim();
      
     var chatik=localStorage.getItem(selectedFriend+'N'+currentUser);

               
              if(chatik!=null&&chatik!="")
               {
                uploadListOfMes(chatik); 
               
               } 
       }, 1000);
 };

var updateUserList = function(){
    setInterval(function(){
    users.collection.reset();
    $('#usersArea').html('');
    getFriendsList();

    $('#usersArea').append(users.$el);
     users.render();
     }, 1000);
  
};
 var loginPage=Marionette.View.extend({
    template:'#login',
    ui:      {
               input: '#usname',
               pass:'#psw',
               submit: '#logNewUser'
             },
    events: {
             'click @ui.submit': function(){

               $('#regORloginArea').html('');
               $('#welcomeLorR').html('');
               $('.three').css('display','block');
               $('.dialog').css('display','block');
               $('.dialogAbove').css('display','block');
               $('.one').css('display','block');
               $('.four').css('display','block');
               $('.two').css('display','block');
              //validate
              getDataFromUser(this.ui.input.val());
              changeNameAndStat();
              uploadListOfUsers();
                (new currentChatView({el:'.four'})).render();
              }
            }
});
 var getDataFromUser=function(str)
 {
 // var me=document.getElementById("usname").value; 
  //var psw=document.getElementById("psw").value;
  currentUser=str.trim(); //alert(currentUser);
  $('#regORloginArea').html('');
  $('#welcomeLorR').html(''); 
 };
 var uploadLog=function(){

    $('#welcomeLorR').html(' ');
    (new loginPage({el:'#welcomeLorR'})).render();
    $('.one').css("display", "block");
};
var regPage=Marionette.View.extend({
    template:'#register',
    ui:     {
             input: '#regname',
             pass:'#regpsw',
             submit: '#regNewUser'
            },
    events: {
            'click @ui.submit': function(){

			  $('.three').css('display','block');
              $('.dialog').css('display','block');
              $('.dialogAbove').css('display','block');
              $('.one').css('display','block');
              $('.four').css('display','block');
              $('.two').css('display','block');
              createUser();
              changeNameAndStat();
              uploadListOfUsers();
              (new currentChatView({el:'.four'})).render();
 			 // show current user identifier with its status
              }
            }
});
var uploadReg=function(){

    $('#welcomeLorR').html(' ');
    (new regPage({el:'#welcomeLorR'})).render();
    $('.one').css("display", "block");
};


var createUser=function()
{   
  var uname=document.getElementById("regname").value; 
  var psw=document.getElementById("regpsw").value;
  var stat=document.getElementById("status").value;
 
  uname=uname.trim();
  //validate
  //userID++;
  var us= new user({username:uname,password:psw,status:stat});
  //console.log(us);
  //main
  //users.collection.add(us);

  localStorage.setItem(uname,JSON.stringify(us));
  AddUserToUsers(uname); 
  updateUserList();
  currentUser=uname;
      
  $('#regORloginArea').html('');
  $('#welcomeLorR').html('');  
};
var uploadListOfUsers=function(){
   
      getFriendsList();
      $('#usersArea').append(users.$el);
       users.render();
      
};
var getFriendsList=function(){
 var userss=getAllUsers().split(',');
 var e;
 for(var i=0;i<userss.length;i++){ 
 if(userss[i]!=currentUser )
  {
   var stringToUser=localStorage.getItem(userss[i]);
     var s=JSON.parse(stringToUser);
   e=new user(s);
     users.collection.add(e);}
   }  
 };
var welcomePage=Marionette.View.extend({
    template:'#start'
  });
var start=function()
{
(new welcomePage({el:'#welcomeLorR'})).render();
$('#loginButton').click(uploadLog);
$('#regButton').click(uploadReg);

};

$(document).ready(function(){
  start();
});