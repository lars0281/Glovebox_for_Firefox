
/*
 * This script is called by background.js when the user selects "reveal URL" from the context menu on a link (the "click" goes to backgroupnd.js which in turn calls this js-script.
 *
 * It presents a dialog window to the user with an explanation of the URL.
 * - where the URL ends up (endpoint of all redirects, if any)
 * - information about what, it anything, happens during the course of those redirects. (etablishment of login, cookies etc.)
 * - give the user the option of passing directly to the endpoint without going through the redirects.
 * - let the user configure default behaviour for next time a link of this type is encountered.
 * 
 * 
 * Issues. 
 * The use of targetElementId which is as yet supported only on Firefox
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/getTargetElement
 */

function xstooltip_findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    //  console.log("xstooltip_findPosx returning: " + curleft);
    return curleft;
}

function xstooltip_findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    // console.log("xstooltip_findPosY returning: " + curtop);
    return curtop;
}

function glovebox_archived_original_href(node) {

    // check if the URL has been inspected already by looking for the attribute glovebox_archived_original_href indicating that the URL has already been been rewritten by glovebox
    // console.log(node.getAttribute('glovebox_archived_original_href'));
    try {
        var archived_url = "";
        archived_url = node.getAttribute('glovebox_archived_original_href');
        //console.log(archived_url);
        //console.log(archived_url.length);
        if (archived_url && archived_url.length > 9) {
            //	console.log("archived");
            return archived_url;
        } else {
            //	console.log("NOT archived");
            return "";
        }
    } catch (e) {
        // clearly, nothing sensible was found, so return a blank.
        return "";
    }

}



function setup_dialog_window(node, new_url, linkUrl ){

	console.log("setup_dialog_window");
//	console.log(node);
//	console.log(new_url);
//	console.log(linkUrl);
	
	

    var uuid;
    uuid = "gloveboxtooltip";

    // look for exising message box, and remove it if found
    var del_it = document.getElementById(uuid);
    console.log("look for existing tooltip");
    console.log(del_it);
    try {
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
    } catch (e) {}
    del_it = document.getElementById(uuid);
    console.log("look for existing tooltip");
    console.log(del_it);
    try {
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
    } catch (e) {}
    del_it = document.getElementById(uuid);
    console.log("look for existing tooltip");
    console.log(del_it);
    try {
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
    } catch (e) {
    	console.log(e);
    }

    try{
    // setup node in the DOM tree to contain content of message box
    var newGloveboxNode = document.createElement("Glovebox");
    newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily addressable.

    //var newGloveboxNode2 = document.createElement("a");
    //newGloveboxNode2.setAttribute("href", "http://www.dn.no");
    //newGloveboxNode2.textContent("http://www.dn.no/NO");
    //newGloveboxNode.appendChild(newGloveboxNode2);

    var newTokenNode = document.createElement("glb:token");

    newGloveboxNode.appendChild(newTokenNode);
    // text marker
    //newTokenNode.textContent = "some MESSAGE text";

var root = document.querySelector(':root');

   // let insertedNode = node.parentNode.insertBefore(newGloveboxNode, node);

let insertedNode =  root.insertBefore(newGloveboxNode, root.firstChild);
   
    
    
    //start lookup
    // call the URL and look at what is returned.

    var true_destination_url = new_url;
    var redirectURL = "";
  
    // create html of tooltip
    var it2 = document.createElement("div");
    //     it2.setAttribute("id",tooltipId+ '_temp');
    it2.setAttribute("id", uuid);
    it2.setAttribute("class", 'xstooltip');
    // set style for the tooltip box. (Replaces an external CSS-stylesheet )
    // visibility: hidden;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 2;
    // font: normal 8pt sans-serif;
    // padding: 3px;
    // border: solid 8px;
    // background-repeat: repeat;
    // background-image: url(icons/azure.png);

//    it2.setAttribute("style", 'position: absolute;z-index:-1;top: 0;left: 0;font: normal 9pt sans-serif;padding: 3px;border: solid 0px;background: rgba(225, 225, 225, 0.9);');
    it2.setAttribute("style", 'position: relative;z-index:-1;top: 0;left: 0;font: normal 9pt sans-serif;text-align: left;wordWrap=break-word;padding: 3px;border: solid 1px;background: rgba(225, 225, 225, 0.9);');

  
    var posX = 150;
    var posY = 20;

  //  var it;
    //it2.innerHTML = inner_html;
   it2.innerHTML = '<table><tr><td style="width: 200px;text-align: leftt">This link ends up at </td><td style="width: 200px;text-align: right" id="gloveboxtooltipclose">close[X]</td></tr></table><a href="' + true_destination_url + '" >' + true_destination_url + '</a>'+
    '<br/> go there directly by just clicking on this link';
  //  '<p class="gloveboxtooltip" id="gloveboxtooltipclose" style="text-align:left;">CLOSE</p>';


  //  console.log("1.2.8");
   // console.log(it2);
    // setup event listener whereby the user can configure this link rewriting to be automatic

    // where to anchor the tooltip
    // add the created tooltip html into the document
//   var inserted =  node.parentNode.appendChild(it2);
  // var inserted =  node.parentNode.insertBefore( it2, node);
   var inserted =  insertedNode.appendChild(it2);

   
 //  console.log(inserted);
   
    // close button
    var close_button = document.getElementById("gloveboxtooltipclose");
  //  console.log(close_button);
    
    // attach eventlistener
    close_button.addEventListener("click", function (event) {
       // console.log("on click action ...");
        close_tooltip(event);
    });
    // make rule to bypass redirects button

  //  var make_bypass_redirect_rule_button = document.getElementById("gloveboxtooltipmakerule");
    // attach eventlistener
 //   make_bypass_redirect_rule_button.addEventListener("click", function (event) {
  //      console.log("on click action ...");
  //      make_bypass_redirect_rule(event);
  //  });

 //   it = it2;

    if ((it2.style.top == '' || it2.style.top == 0 || it2.style.top == "0px")
         && (it2.style.left == '' || it2.style.left == 0 || it2.style.left == "0px")) {
        // need to fixate default size (MSIE problem)
        it2.style.width = it2.offsetWidth + 'px';
        it2.style.height = it2.offsetHeight + 'px';

        // if tooltip is too wide, shift left to be within parent
        if (posX + it2.offsetWidth > node.offsetWidth)
            posX = node.offsetWidth - it2.offsetWidth;
        if (posX < 0)
            posX = 0;

        x = xstooltip_findPosX(node) + posX;
        y = xstooltip_findPosY(node) + posY;

        it2.style.top = y + 'px';
        it2.style.left = x + 'px';
    
     it2.style.visibility = 'visible';
     it2.style.zIndex="1000";
 
     // examin options to make the width context sensitive
     it2.style.width = 300 + 'px';
     
}

// depending on the rule settings...rewrite the link automatically.

//if (new_url.length > 9 && linkUrl != new_url) {
//    console.log("replacing: " + linkUrl + " with " + new_url);
//    node.setAttribute('href', new_url);
//    // archive the original URL as an inserted attrbute
//    node.setAttribute('glovebox_archived_original_href', linkUrl);
//} else {
//    console.log("invalid returns");
//}

    } catch (e) {
    	console.log(e);
    }

}


function make_bypass_redirect_rule(event) {

    console.log(event);
    // create a rule whereby this action can be taken automatically from now on

    // formulate the rule

    // the links obsure the true endpoint. Unlike some links on platforms like facebook,
    //there is no information in the link itself (such as in the query string) whereby the true endpoint can be determined.

    // ( In instances where the true endpoint can be determined from the URL, the URL should not be called at all. )
    // But in the case at hand here, the URL must be called in some limited way so that the redirect information (either HTTP 302 or HTTP-META) can be received.
    // The limited call should to the extent possible be clear of any tracking information.
    // Source IP is unavoidable. But cookies should be excludable such that the redirecting endpoint will have difficulty correlating the traffic.

    // The rule will match link URLs on patterns
    // The assumtion being that these will link shorteners of the bit.ly type that looks like https://<domain>/<code> where the code uniquely identifies the true endpoint.
    // The rule will be a regexp pattern that identifies such a link.
    // the domain will be fully qualified and at rule lookup time, the domain is used as a key to look up the rule.

    // Multiple rules are possible on the same domain. They must be mutually exclusive.


    // Step 1. The content script read the rule set from the background.js at starup time.

    // Step 2. link comes in, looking like "http://bit.ly/abcedfgh"
    // Step 3. exact protocol, domain and port (if any) "http://bit.ly/"
    // Step 4. Check for rule governing "http://bit.ly/"
    // Step 5. Find one rule - looking like "http://bit.ly\/[^\/*]$"
    // Step 6. Match rule against link URL
    // Step 7. OK, link "http://bit.ly/abcedfgh" matches against rule "http://bit.ly\/[^\/*]$"
    // Step 8. If "OK" in step #7 then make clean call to the URL to find out what it redirets to. Return to Step #2

    //

    // the


    // send rule to plugin (background.js) for storage in the database


}

function close_tooltip(event) {

    console.log(event);
    // call to kill the tooltip window


    // lookup the endpoint of the link
    var uuid;
    uuid = "gloveboxtooltip";

    // look for exising message box, and remove it if found
    var del_it = document.getElementById(uuid);
    console.log("look for existing tooltip");
    console.log(del_it);
    try {
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
    } catch (e) {}
    del_it = document.getElementById(uuid);
    console.log("look for existing tooltip");
    console.log(del_it);
    try {
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
    } catch (e) {}

}

function rules_enforcement(url) {
    var new_url = url;
    // start with source-based rules.
    // these are rules based on the the url of the page where the links are located.
    console.log("#source based rewriting");
    //  new_url = circumstantial_rules_enforcement(window.location.href, new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
    new_url = circumstantial_rules_enforcement("https://www.facebook.com/", new_url, source_url_rules, source_fulldomain_rules, source_domain_rules);
    console.log(new_url);

    // then do destination-based rules
    // note that this is on top of any changes made above.
    console.log("#destination based rewriting");

    new_url = circumstantial_rules_enforcement(new_url, new_url, destination_url_rules, destination_fulldomain_rules, destination_domain_rules);
    console.log(new_url);
    return new_url;
}

function circumstantial_rules_enforcement(location, linkurl, url_rules, fulldomain_rules, domain_rules) {
    var new_url = "";
    // fall-back is to simply return the submitted value
    new_url = linkurl;
    // look for applicable rules using the value of "location" as referece, apply rules to the URL in "linkurl"

    console.log(location);
    console.log(linkurl);
    console.log(url_rules);
    console.log(fulldomain_rules);
    console.log(domain_rules);

    // use this to lookup any rules that may apply to this url
    var protocoldomainportpath = "";
    protocoldomainportpath = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');
    //console.log("# checking current url (" + protocoldomainportpath + ") against url-specific rules.");
    //console.log(url_rules);
    var rewrite_steps_for_this_URL = [];
    var rewrite_stepcount_for_this_URL = 0;
    try {
        rewrite_steps_for_this_URL = url_rules[protocoldomainportpath];
        if (rewrite_steps_for_this_URL) {
            if (rewrite_steps_for_this_URL.length > 0) {
                rewrite_stepcount_for_this_URL = rewrite_steps_for_this_URL.length;
            }
        }
        // console.log("url was found in url-specfic rule store");
        // console.log(rewrite_step_count_for_this_URL);
    } catch (e) {
        // console.log("url not round in url-specfic rule store");
        rewrite_stepcount_for_this_URL = 0;
    }

    // lookup rules for this location fulldomain

    var protocolfulldomainport = "";
    protocolfulldomainport = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');

    console.log("# checking current fulldomain (" + protocolfulldomainport + ") against fulldomain-specific rules:  (" + ")");
    // console.log(domain_rules);
    var rewrite_steps_for_this_fulldomain = [];
    var rewrite_stepcount_for_this_fulldomain = 0;

    // var source_based_rewrite_step_count_for_this_domain = 0;
    try {
        rewrite_steps_for_this_fulldomain = fulldomain_rules[protocolfulldomainport];
        //console.log(rewrite_steps_for_this_fulldomain);
        if (rewrite_steps_for_this_fulldomain) {
            //console.log(rewrite_steps_for_this_fulldomain.length);
            if (rewrite_steps_for_this_fulldomain.length > 0) {
                rewrite_stepcount_for_this_fulldomain = rewrite_steps_for_this_fulldomain.length;
                //console.log(rewrite_stepcount_for_this_fulldomain) ;
                //console.log("url was found in domain-specfic source rule store");
            }
        }
    } catch (e) {
        //console.log("url not found in domain-specfic rule store");
        source_based_rewrite_stepcount_for_this_fulldomain = 0;
        //console.log(source_based_rewrite_steps_for_this_fulldomain) ;
    }

    // lookup rules for this location domain ("top"-level example domain.com ) ignoring the first word in the fully qualified domain name

    var domainport = "";
    domainport = location.replace(/^http[s]*:\/\/[^\.]*\.([^\/]*)\/([^\?]*).*/i, '$1');

    console.log("# checking current domain (" + domainport + ") against domain-specific rules:  (" + ")");
    // console.log(domain_rules);
    var rewrite_steps_for_this_domain = [];
    var rewrite_stepcount_for_this_domain = 0;

    // var source_based_rewrite_step_count_for_this_domain = 0;
    try {
        rewrite_steps_for_this_domain = domain_rules[domainport];
        //console.log(rewrite_steps_for_this_fulldomain);
        if (rewrite_steps_for_this_domain) {
            //console.log(rewrite_steps_for_this_fulldomain.length);
            if (rewrite_steps_for_this_domain.length > 0) {
                rewrite_stepcount_for_this_domain = rewrite_steps_for_this_domain.length;
                //console.log(rewrite_stepcount_for_this_fulldomain) ;
                //console.log("url was found in domain-specfic source rule store");
            }
        }
    } catch (e) {
        //console.log("url not found in domain-specfic rule store");
        source_based_rewrite_stepcount_for_this_domain = 0;
        //console.log(source_based_rewrite_steps_for_this_fulldomain) ;
    }

    console.log("URL based rewrite rule step count: " + rewrite_stepcount_for_this_URL);
    console.log(rewrite_steps_for_this_URL);
    console.log("fulldomain based rewrite rule step count: " + rewrite_stepcount_for_this_fulldomain);
    console.log(rewrite_steps_for_this_fulldomain);
    console.log("domain based rewrite rule step count: " + rewrite_stepcount_for_this_domain);
    console.log(rewrite_steps_for_this_domain);

    if (rewrite_stepcount_for_this_URL > 0) {
        //console.log("#### there were some URL rule(s)");
        new_url = execute_rule_set(rewrite_steps_for_this_URL, linkurl);
    } else {
        // no url-specific rules found, look for fulldomain specific rules
        // anything for the fully qualified domain ?
        if (rewrite_stepcount_for_this_fulldomain > 0) {
            new_url = execute_rule_set(rewrite_steps_for_this_fulldomain, linkurl);
        } else {
            // no fulldomain source rules either
            // anything for the domain ?
            if (rewrite_stepcount_for_this_domain > 0) {
                new_url = execute_rule_set(rewrite_steps_for_this_domain, linkurl);
            } else {
                // no domain source rules either
            }
        }
    }
    return new_url;
}

function execute_rule_set(rule_set, url) {
    console.log("execute_rule_set");
    console.log(rule_set);
    var new_url = "";
    new_url = url;
    for (let m = 0; m < rule_set.length; m++) {
        new_url = execute_rule_step(rule_set[m], new_url);
    }
    return new_url;
}

function execute_rule_step(rule_step, url) {
    console.log("execute_rule_step");
    var new_url = "";
    new_url = url;
    console.log("apply step: " + rule_step + " to " + new_url);

    // syntax is STEP NAME ( PARAMETER VALUE)
    var step_name = ""
        var parameter_value = "";

    step_name = rule_step.replace(/\(.*$/i, '').replace(/^ */i, '');
    var param_regexp = /\(/;
    if (param_regexp.test(rule_step)) {
        parameter_value = rule_step.replace(/[^(]*\(/i, '').replace(/\) *$/i, '');
    }
    console.log("step_name: " + step_name);
    console.log("parameter_value: " + parameter_value);
    switch (step_name) {
    case 'regexp':
        // make allowances for g and i settings
        // Parse parameter which follows the sed-syntax
        // This means that the second character is the delimiter
        var delimiter = "";
        delimiter = parameter_value.replace(/^s(.).*/i, '$1');
        var flags_ext = new RegExp("[s]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "[^" + delimiter + "]*" + delimiter + "(.*)$");
        var flags = "";
        flags = parameter_value.replace(flags_ext, '$1').replace(/ /g, '');
        //console.log("flags_ext: " + flags_ext);
        //console.log("flags: " + flags);
        var pattern_ext = new RegExp("[s]*" + delimiter + "([^" + delimiter + "]*)" + delimiter + ".*$");
        var pattern = "";
        pattern = parameter_value.replace(pattern_ext, '$1');
        //console.log("pattern_ext: " + pattern_ext);
        //console.log("pattern: " + pattern);
        var val_ext = new RegExp(".*" + delimiter + "([^" + delimiter + "]*)" + delimiter + "[ gi]*$");
        var val = "";
        val = parameter_value.replace(val_ext, '$1');
        //console.log("val_ext: " + val_ext)
        //console.log("val: " + val)
        //console.log(new RegExp(pattern, flags));
        new_url = new_url.replace(new RegExp(pattern, flags), val);
        break;
    case 'qs_param':
        console.log(new_url);
        new_url = url_rewrite_step_qs_param(new_url, parameter_value);
        break;
    case 'uri_decode':
        try {
            // for some reason decodeURI does not work
            new_url = new_url.replace(/%40/g, '@').replace(/%3A/g, ':').replace(/%3B/g, ';').replace(/%3C/g, '<').replace(/%3D/g, '=').replace(/%3E/g, '>').replace(/%3F/g, '?').replace(/%20/g, ' ').replace(/%21/g, '!').replace(/%22/g, '"').replace(/%23/g, '#').replace(/%25/g, '%').replace(/%26/g, '&').replace(/%28/g, '(').replace(/%29/g, ')').replace(/%2A/g, '*').replace(/%2B/g, '+').replace(/%2C/g, ',').replace(/%2D/g, '-').replace(/%2E/g, '.').replace(/%2F/g, '/').replace(/%5B/g, '[').replace(/%5C/g, '\\').replace(/%5D/g, ']').replace(/%5E/g, '^').replace(/%5F/g, '_').replace(/%60/g, "'").replace(/%25/g, '%');
        } catch (e) { // catches a malformed URI
            console.error(e);
        }
        break;
    case 'base64_decode':
        console.log(new_url);
        new_url = atob(new_url);
        break;
    case 'JSON_path':
        console.log(new_url);
        console.log(JSON.parse(new_url)[parameter_value]);

        new_url = JSON.parse(new_url)[parameter_value];
        break;
    case 'replace_with':
        console.log(new_url);
        new_url = parameter_value;
        break;
    case 'skinny_lookup':
        // lookup the URL and if it returns a HTTP 403 redirect and a Location header, insert that.
        // Itterate up to three times incase on redirect leads to another.
        console.log("lookup the URL without revealing anything");
        //new_url = parameter_value;
        break;
    default:
    }

    return new_url;

}

var source_fulldomain_rules = {};
var source_url_rules = {};
var source_domain_rules = {};
var destination_url_rules = {};
var destination_fulldomain_rules = {};
var destination_domain_rules = {};

// this global variable indicated whether or not any rule pertain to the URL
var ruleHit = false;
//this global variable indicated whether or not any
var ruleWrite = false;

function RevealUrl(request, sender, sendResponse) {

    var replacementStr = request.Paste_GloveboxAcceptedSecureKeyOfferToken_text;
    console.log("RevealUrl.js JSON(request): " + JSON.stringify(request));

    try {
        //if (replacementStr){
        var targetElementId = "";
        targetElementId = request.targetElementId;

        ruleHit = false;
        var linkUrl = "";
        linkUrl = request.linkUrl;
        var linkText = "";
        linkText = request.linkText;

        var true_destination_url = "";
        true_destination_url = request.true_destination_url;

        // if the link has the same domain as the current domain, also search using a server relative path




        
       // console.log("relative_link: " + relative_link);
       // console.log("ruleHit: " + ruleHit);
        // chase down what the URL leads too.

        // locate the DOM node actually right-clicked by the user
        var node = null;
        
        // in the absence of broad support for targetElementId() on non-Firefox browsers, use xpath as a work-around.
        // this must be rewritten for non-firefox browsers

        node = browser.menus.getTargetElement(targetElementId);

        // attempt to uniquely identify the link selected with a right click by searching for one that has the same link and text.
        // search for both server-relative and fully qualified links

        // console.log("current domain: " + window.location.href);
        // var protocolfulldomainport = "";
        // protocolfulldomainport = window.location.href.replace(/^(http[s]|file)*(:\/\/*)([^\/]*)(\/[^\?]*).*/i, '$1$2$3');
        //var currentdomain_reg_exp = new RegExp(protocolfulldomainport , 'i');
        //console.log(currentdomain_reg_exp);
        //var relative_link = "";
        //if (currentdomain_reg_exp.test(linkUrl)) {
       //     console.log("link is in current domain");
       //     relative_link = linkUrl.replace(currentdomain_reg_exp,'');
       // } else {
       // }


        // Hopefully there is only one on the page that has the exact combination.
      //  var nodesSnapshot = document.evaluate("//a[@href='" + linkUrl + "' or @href='" + relative_link + "']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        // if more than one identical link is found, rewrite them all

      //  for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
      //      node = nodesSnapshot.snapshotItem(i);
      //      console.log(nodesSnapshot.snapshotItem(i).textContent);
      //  }

        // using the selector a:hover does not guarantee the correct node (see xpath above)
        // console.log(document.querySelector("a:hover"));
        // node = document.querySelector("a:hover")

        console.log(node);

        // check if the URL has been inspected already by looking for the attribute glovebox_archived_original_href indicating that the URL has already been been rewritten by glovebox

     //   console.log(glovebox_archived_original_href(node));
     //   if (glovebox_archived_original_href(node)) {
     //       console.log("archived");

            // if the URL has been archived it means that it has been examined before.
            // The original value should be used in any reexamination.
            // (the endpoint may have changed, in any case there is no point in examining the endpoint itself)
     //       linkUrl = glovebox_archived_original_href(node);
     //   } else {
     //       console.log("NOT archived");
     //       // proceed
     //   }

        // consult applicable rules for this link

        // Both source and destination rules are applied. With source rules applied first. Links may be rewritten by one source rule, follow by one destination rule.


        // rewrite URLs from the page
        // the rules applies to link found on a matching page/url, regardless of here to go to

        // look for bit.ly link wherever we can find them.

        // for any link found on www.facebook.com remove the query string parameter "fbclid"
        //source_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];

        // for any link found on www.facebook.com remove the query string completely on any link that goes to some other domain
        source_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sD(?<!facebook.com.*)\\?.*DDg)"];

        source_fulldomain_rules['https://www.imdb.com/'] = ["regexp(sDcharDCHARDg)"];
        // while on linkedin, remove all querystring parameters to other URLs on linkedin
        source_fulldomain_rules['https://www.linkedin.com/'] = ["regexp(sD\\?.*DDg)"];

        // rewrite URLs on the page
        // these rules applies to link to URL, regardless of where they are found

        // data structure containing the rules for which URL are to be considered, and what to do with them
        // in priority order. a maximum of one rule can be used.

        // for now, accept a loop-inside-loop-inside-loop arrangement. (shudder!)
        // scope rules for current page domain

        // console.log(document);


        // which URL this applies to - what steps to carry out , in order, to compute the correct URL from available data (The query string typically).

        // sample https://l.facebook.com/l.php
        // 1. step Extract parameter "u" from the query string
        // 2. step URI decode
        // done

        destination_url_rules['https://l.facebook.com/l.php'] = ["qs_param(u)", "uri_decode"];

        // a somewhat more complex example

        // sample https://l.facebook.com/l.php
        // 1. step - Extract parameter "payload" from the query string
        // 2. step - URI decode
        // 3. step - BASE64 decode
        // 4. step - in JSON structure get value found at path "url"
        // done

        destination_url_rules['https://ideas-admin.lego.com/mailing/email_link'] = ["qs_param(payLoad)", "uri_decode", "base64_decode", "JSON_path(url)"];

        // a very simply example
        // where the link is to a tracker, and the final URL is to common URL - The rule is just an alias
        // 1. step Replace with

        destination_url_rules['https://dagsavisen.us11.list-manage.com/track/click'] = ["replace_with(http://www.dagsavisen.no/minside)"];

        // match against the URL on pattern

        destination_url_rules['https://www.aftenposten.no/meninger/kommentar.*'] = ["regexp(?.*)"];

        // match against the URL on pattern

        // destination_url_rules['http://ad.doubleclick.net/ddm/trackclk.*'] = ["regexp(\?.*)"];

        // eliminate "URL shorteners" such as bit.ly
        // rules for which domain names should be considered automatic redirtors that obscure the true endpoint
        // In case the URL is matched, call the URL and determin if the response in an automatic redirect.
        // If so, replace the link with this value so as to avoid calling the redirecting site. Rewrite URL (href attribute in the DOM,if possible.

        // collect the rule set from background.js
        // as a temprorary measure, keep the rules statically right here


       // destination_fulldomain_rules['https://lnkd.in/'] = ["skinny_lookup"];
        destination_fulldomain_rules['https://cutt.ly/'] = ["skinny_lookup"];
        destination_fulldomain_rules['https://tinyurl.com/'] = ["skinny_lookup"];
        destination_fulldomain_rules['https://youtu.be/'] = ["skinny_lookup"];

        // of this domain there is a lot of stuff going in the path-path of the URL. match on some part of this path before engaging in the rewrite
        destination_fulldomain_rules['http://ad.doubleclick.net/'] = ["regexp(sD.*(http[s]*://[^&]*).*D$1Dg)", "regexp(sD\\?.*DDg)"];

        // remove query string from links to www.facebook.com/some-single-phrase
        destination_fulldomain_rules['http://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];
        destination_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];

        // for linkedin URLs up update feeds,  remove querystring
        destination_fulldomain_rules['https://www.linkedin.com/'] = ["regexp(sD(.*linkedin.com/feed/update/.*)\\?.*D$1Dg)"];

        //
        destination_domain_rules['ct.sendgrid.net'] = ["regexp(sD-D%Dg)"];

        var new_url = linkUrl;
        console.log("#### " + new_url);
        new_url = rules_enforcement(new_url);
        console.log("#### " + new_url);
        console.log("ruleHit: " + ruleHit);
        // if the rules caused the URL to be changed, there might also be rules governing the new URL, so run through it again.


        new_url = rules_enforcement(new_url);
        console.log("#### " + new_url);

        // Call the URL by default if not rules applies to the URL.
        // If the URL has not been changed, assume no rule pertained to it, so look it up directly.


        console.log(linkUrl);
        console.log("#### " + new_url);

       
            // make the call anyway
            // The ID of the extension we want to talk to.
            var editorExtensionId = "addon@glovebox.com";

            // Make a simple request:
            console.log("#make call to background");
            browser.runtime.sendMessage(editorExtensionId, {
            	request: "skinny_lookup",
                linkurl: new_url
            },
                function (response) {
            	console.log(response);
                if (!response.success) {
                    console.log("## error");
                    console.log(response);
                    new_url = response.true_destination_url;
                    console.log(linkUrl);
                    console.log(new_url);
                    // create alternate window for user to see, and click in
                    setup_dialog_window(node, new_url, linkUrl );
                } else {
                    console.log("## success");
                    console.log(response);
                    new_url = response.true_destination_url;
                    console.log(linkUrl);
                    console.log(new_url);
                    console.log(node);
                   
                    // create window for user to see, and click in
                    setup_dialog_window(node, new_url, linkUrl );
                }
                //                      handleError(url);
            });
            

    } catch (e) {
        console.log(e);
    }

    return Promise.resolve({
        response: {
            "selection_html": "ok"
        }
    });
}
//}

//
browser.runtime.onMessage.addListener(RevealUrl);

// setup onClick listener to remove tooltip window for any click.