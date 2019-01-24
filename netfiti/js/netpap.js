$(document).ready(function(){



    function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie()
{
    var user = getCookie("username");
    if (user != "") {

    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
      }
  }


    function getPlatformType() {
      	if(navigator.userAgent.match(/mobile/i)) {
      		return 'Mobile';
      	} else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
      		return 'Tablet';
      	} else {
      		return 'Desktop';
      	}
      }
      function getExpiry(expiry)
      {
        // return new Date().toISOString()-new Date(expiry);
      }



      function getMedia(data)
      {
        var root1= $("#netpap-root-media-1");
        var root_header= $("#netpap-root-media-1-header");

        $.ajax({
          "url":data['url']+"/retrieve/media/",
          "data":data,
          method:"POST"
        }).done(function(resp){
            var sendReport=[];
            setCookie("visitor",resp['uid'],365000);
            /* display image */
            var dat=resp['mine'].concat(resp['netpap']);
            $.each(dat,function(k,v){
              console.log(k);
              console.log(v['campaign_type']);

              if (v['campaign_type'] == "IMAGE")
              {
                console.log("deni")
                if(k == 0){
                  root_header.css({"background":"rgba(0,0,0,0.5)"});
                  root1.css({"object-fit": "cover"});
                  var width=0;
                  if(data['screenw']>500){
                    width=500
                  }
                  else{
                    width=data['screenw'];
                  }
                  root1.html("<a class=\"netpap-space\"   netpap-data-value="+v.id+" netpap-data-key="+data['banner_name']+"  href="+v.redirect_url+"><img   style=\"width:"+width+"px;height:300px;\" data=\"landing\" id=\"landing\" class=\"card-bkimg\" "+v.campaign_name+" src="+data['url']+v.image_url+"></a>")

                  //setCookie("img1",v.image_url,getExpiry(v.campaign_end));
                  root_header.html("<span style=color:white;>"+v.campaign_name+"</span>");
                  sendReport.push(v.id); //itesm that were viewed
                }
              }
              else(v['campaign_type'] == "link")
              {

              }

            });

            sendMediaReport(data);

        });
      }
    navigator.brows= (function(){
        var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    var visitor = getCookie("visitor");
    var banner_name=$("#netpap-root").attr("data-banner-name");
    var hotspot=$("#netpap-root").attr("data-hotspot");
    var owner=$("#netpap-root").attr("data-owner");
    var mac_address=$("#netpap-root").attr("data-mac-address");
    $("#netpap-id").html("Ads via Netpap");
    var browser=navigator.brows;
    var os=navigator.platform;
    var screenh=screen.height;
    var screenw=screen.width;
    var start_session =new Date();



    var device=getPlatformType();


    var url="https://netpap.co.ke";
    var data={"browser":browser,"os":os,"mac_address":mac_address,"banner_name":banner_name,
          "device":device,"screenw":screenw,"screenh":screenh,"hotspot":hotspot,"owner":owner,"url":url
          }


    console.log(visitor)

    if (visitor != "" && visitor != null) {
      /*welcome sir/madam */
      /* update view  */
      if (window.performance) {
  console.info("Alright .,,alright working..");
    }
  if (performance.navigation.type == 1) {
    console.info( "DO nothing is page is reloaded" );
      getMedia(data);

  } else {

    getMedia(data);
    $.ajax({"url":url+"/hotspot/visit/update/","data":data,"method":"POST","dataType":"json"}).done(function(e){console.log(e)  }).fail(function(e){console.log(e);});

  }
    }
    else{






      getMedia(data);




  }

function  sendHotspotReport(data)
  {
    $.ajax({"url":data['url']+"/hotspot/visit/","data":data,"method":"POST"}).done(function(e){
      /* succeed silently */
      setCookie("visitor",e['uid'],365000);
      /* get anonymous user id and store in a cookie*/


    }).fail(function(e){

      /*fail silently*/
    });
  }
function  sendMediaReport(data)
  {

    $.ajax({
      "url":data['url']+"/media/store/report/",
      "data":data,
      method:"POST"
    }).done(function(){



    });
  }


  ///not click action

  $("#netpap-root-media-1").on("click","a",function(){
    data["id"]=$(this).attr("netpap-data-value");
    data['banner_name']=$(this).attr("netpap-data-value");

    $.ajax({"url":url+"/store/media/click/",
            "data":data,
            "method":"POST"
  }).done(function(dat){
      console.log(dat);
  }).fail(function(dat){
    console.log(dat)

  });


  });

  $( window ).unload(function() {
    console.log("denis mwiti")
    data['start_session']=start_session;
    data['end_session']=new Date();
    //get all loaded images
    var campaigns=[];
    $(".netpap-space").each(function(k,v){
    console.log(v)
    campaigns.push($( this ).attr("netpap-data-value"));

    });

    data['campaign']=JSON.stringify(campaigns);
    console.log(data)
    $.ajax({"url":url+"/store/media/session/",
            "data":data,
            "method":"POST",async: false
  }).done(function(dat){
      console.log(dat);
  }).fail(function(dat){
    console.log(dat)

  });


});


});
