/*
 * This file is responsible for performing the logic of replacing
 * all oc.
 */

/*global URLRevealThyself*/

console.log("###############################");
console.log("### running URLRevealThyself.js");
console.log("###############################");

/*
 *
 *
 *  * This script examines URL links in a page and according to set rules do one of two things
 *
 * Determine the true endpoint of URLs by calling them and see if they result in a redirect.
 * In which case the URL of that redirect is substituted for the URL
 *
 * The point here is to reveal the true URL behind such things as link-shorteners (bit.ly , among others)
 * and also let to use to go straight there bypassing the URL-shorteners alltogther.
 *
 * If the URL contains the value of the final endpoint, the URL link is rewritten to point directly to that endpoint,
 * again to let the user go straight to the endpoint bypassing the intermediary step.
 *
 * Example
 *
 * https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DJFozGfxmi8A
 * This link takes the user by way of a Facebook service and then redirect to the url https://www.youtube.com/watch?v=JFozGfxmi8A
 * The DeObfuscator will swap in https://www.youtube.com/watch?v=JFozGfxmi8A allowing the user to go straight there when clicking the link.
 *
 * Another example
 *
 * This is the link that comes up on top in the google search results when searching for Londond Underground
 * https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwi79Jba9qDvAhVPtIsKHTOiBMMQFjAAegQIDRAD&url=https%3A%2F%2Ftfl.gov.uk%2Fmodes%2Ftube%2F&usg=AOvVaw1SmB6_67N6zazPzqcBglX8
 * It takes the user bay way of Google before redirecting to https://tfl.gov.uk/modes/tube/
 * The urldeobfuscator will swap in this value, thereby letting the user click straight through to Londond Underground without letting Google troubling Google any further
 *
 */


/* to develop
* record instances of automatic redirection and uses these as a basis for rules
**/


// detect of the status bar and href value of a URL are different

// filter on which domains/pages the rewriting is to be done at

/* additional work
 *
 * read rules at statup time
 * rules will be maintain in the glovebox console and updates pushed from there out to this script.
 *
 * make calls to redirect URL recursive up to n number of time
 * look for html-based redirects in pages where there is no Location header returned
 *
 * <meta http-equiv="refresh" content="time; URL=new_url" />
 *
 *
 */

function dynamicEvent() {
    console.log("dynamic event");
}


var source_fulldomain_rules = {};
var source_url_rules = {};
var source_domain_rules = {};
var destination_url_rules = {};
var destination_fulldomain_rules = {};
var destination_domain_rules = {};

destination_url_rules['https://l.facebook.com/l.php'] = ["qs_param(u)", "uri_decode"];
destination_url_rules['https://ideas-admin.lego.com/mailing/email_link'] = ["qs_param(payLoad)", "uri_decode", "base64_decode", "JSON_path(url)"];
destination_url_rules['https://dagsavisen.us11.list-manage.com/track/click'] = ["replace_with(http://www.dagsavisen.no/minside)"];
destination_url_rules['https://www.aftenposten.no/meninger/kommentar.*'] = ["regexp(?.*)"];

destination_domain_rules['ct.sendgrid.net'] = ["regexp(sD-D%Dg)"];



function rules_enforcement( url){
	var new_url = url;
	// start with source-based rules.
	// these are rules based on the the url of the page where the links are located.
	console.log("#source based rewriting");
	//  new_url = circumstantial_rules_enforcement(window.location.href, new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
	  new_url = circumstantial_rules_enforcement("https://www.facebook.com/", new_url,source_url_rules,source_fulldomain_rules,source_domain_rules);
	  console.log(new_url);

	  // then do destination-based rules
	  // note that this is on top of any changes made above. 
	  console.log("#destination based rewriting");
	  
	  new_url = circumstantial_rules_enforcement(new_url, new_url,destination_url_rules,destination_fulldomain_rules,destination_domain_rules);
	  console.log(new_url);
	return new_url;
	  }




function circumstantial_rules_enforcement(location, linkurl,url_rules,fulldomain_rules,domain_rules) {
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
        	if (rewrite_steps_for_this_URL.length > 0){
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
            if (rewrite_steps_for_this_fulldomain.length > 0){
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
            if (rewrite_steps_for_this_domain.length > 0){
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




/*
 *
 *
 *
 */

function interceptClickEvent(e) {
	return; //disable this for now
	
    var href;
    var target = e.target || e.srcElement;
    console.log("##################################");
    console.log("#### click event intercept #######");
    console.log("##################################");
    console.log(e);
    console.log(target);
    console.log(target.tagName);
    console.log(target.parentElement);
    console.log(target.parentElement.parentElement.innerHtml);
    console.log(target.parentElement.parentElement.parentElement.innerHTML);
    console.log(target.parentElement.parentElement.attributes);
    console.log(target.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentElement.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentElement.parentElement.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentElement.parentElement.parentElement.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.attributes.getNamedItem('href'));
    console.log(target.parentNode);
    console.log(target.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    console.log(target.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));
    console.log(target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"));

    //tell the browser not to respond to the link click
    e.preventDefault();
    e.stopPropagation();
    // find the damned href attribute. Facebook tried to hide it upwards in the DOM tree

    var attempted_location = "";
    var i=0;
    var parent = target.parentNode;
    try{
    // loop upward in the DOM until found, of a maximum of 12 layers
    while (i<12 && !(Boolean(attempted_location))){
    	attempted_location = parent.getAttribute("href");
console.log(attempted_location);
console.log(i);
parent = parent.parentNode;
i++;
    	
    } 
    }catch(f){
    	console.log(f);
    }
    console.log("1.1");
    
// apply any rules to the link    

    // rewrite URLs from the page
    // the rules applies to link found on a matching page/url, regardless of here to go to

    // look for bit.ly link wherever we can find them.

    // for any link found on www.facebook.com remove the query string parameter "fbclid"
    //source_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];
    try{
 // for any link found on www.facebook.com remove the query string completely on any link that goes to some other domain
    source_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sD(?<!facebook.com.*)\\?.*DDg)"];
    
    
    source_fulldomain_rules['https://www.imdb.com/'] = ["regexp(sDcharDCHARDg)"];
//while on linkedin, remove all querystring parameters to other URLs on linkedin
    source_fulldomain_rules['https://www.linkedin.com/'] = ["regexp(sD\\?.*DDg)"];
 
    console.log(window.history);

    console.log("1.2");

    destination_fulldomain_rules['https://lnkd.in/'] = ["skinny_lookup"];
    destination_fulldomain_rules['https://cutt.ly/'] = ["skinny_lookup"];
    destination_fulldomain_rules['https://tinyurl.com/'] = ["skinny_lookup"];
    destination_fulldomain_rules['https://youtu.be/'] = ["skinny_lookup"];

    // of this domain there is a lot of stuff going in the path-path of the URL. match on some part of this path before engaging in the rewrite
    destination_fulldomain_rules['http://ad.doubleclick.net/'] = ["regexp(sD.*(http[s]*://[^&]*).*D$1Dg)", "regexp(sD\\?.*DDg)"];

    // remove query string from links to www.facebook.com/some-single-phrase
    destination_fulldomain_rules['http://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];
    destination_fulldomain_rules['https://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];

    console.log(window.history);

    
   
    // 
    }catch(g){
    	console.log(g);
    }
    var new_url = attempted_location;
    console.log("#### "+new_url);
    new_url = rules_enforcement( new_url);
    console.log("#### "+new_url);
    
    console.log(window.history);
    alert("This is alert box! trying to get to " + new_url);

    // Find out what should be the target of this click
 // redir to the correct URL
    window.open( new_url, '_blank' );
    console.log(window.history);
    
    //window.location.href = new_url;
   // maybe
    
    // apply the rules to the link about to be accessed. This is needed becasue Facebook dynamically creates the links 
    //alert("This is alert box! trying to get to " + new_url);
    
    var destination_url_rules = [];
    // a rule for use at google.com only
    destination_url_rules.push(['^h.*google.com', '.*url=(h.*[^&]*2F[^&]*).*', '$1']);
    // a rule for use at facebook.com only
    destination_url_rules.push(['^h.*facebook.com', '.*url=(h.*[^&]*2F[^&]*).*', '$1']);

    // eliminate "URL shorteners" such as bit.ly
    // rules for which domain names should be considered automatic redirtors that obscure the true endpoint
    // In case the URL is matched, call the URL and determin if the response in an automatic redirect.
    // If so, replace the link with this value so as to avoid calling the redirecting site. Rewrite URL (href attribute in the DOM,if possible.

    var destination_domain_rules = [];
    // look for bit.ly link wherever we can find them.
    destination_domain_rules.push(['.*', 'ht.*bit.ly/']);
    destination_domain_rules.push(['.*', 'ht.*lnkd.in/']);

    var result_regexp = "";
    //result_regexp = 're $1 p';

    console.log(attempted_location);

    // consider the rules to see if this link should be rewritten
    // The URL of the current page is
    var current_location = window.location.href
        console.log("current_location: " + current_location);
return;

    //var attempted_location = window.location.href

        // which tags to consider (a, span etc.)
        if (target.tagName === 'A') {
            console.log("a regular link");
            href = target.getAttribute('href');
            attempted_location = target.getAttribute('href');
        } else if (target.tagName === 'SPAN') {
            // for now this is very brittle code created for use against Google
            console.log("a span link");
            // in the case of SPAN, search for the href attribute
            var href = target.parentElement.parentElement.attributes.getNamedItem('href').textContent;

            // check for any rule pertaining to this location
            for (let j = 0; j < rules.length; j++) {
                // check URL/domain against a regexp for the

                var domain_regexp = new RegExp(destination_url_rules[j][0]);

                console.log("checking current location against: " + domain_regexp + " (" + domain_regexp.test(window.location.href) + ")");

                if (domain_regexp.test(window.location.href)) {
                    // ok, the rule pertains URLs on this page


                    // only consider those who match one or ]more of the rewrite rules

                    var href_regexp = "";
                    href_regexp = new RegExp(destination_url_rules[j][1]);
                    var rep = destination_url_rules[j][2];

                    // does the pattern even match the URL ?
                    console.log("attempting target URL match for " + href + " on this rule: " + href_regexp + "(" + href_regexp.test(href) + ")")
                    if (href_regexp.test(href)) {
                        console.log("################## a rule match for: " + href_regexp);
                        //ok, the rules does match the URL
                        // attempt to rewrite
                        var new_target_url = "";
                        // apply the regexp rewriting pattern - followed by URI decoding
                        new_target_url = decodeURIComponent(href.replace(href_regexp, rep));
                        console.log(new_target_url);

                        // termiate the click event
                        e.preventDefault();

                        // redir to the correct URL
                        window.location.href = new_target_url;

                        // console.log(elements[i].getAttribute("href").replace(href_regexp, rep));
                    } else {
                        console.log("no match on rewriting rule - do nothing");
                    }

                    // if "span" element, search upward in the DOM tree nfor the first element with a href attribute
                    // This is a remedy for how google burries the true destination for a link.

                } else {
                    console.log("no match on current location - do nothing");
                }

            }
        }

        target.parentElement.parentElement.attributes.setNamedItem('href') = "http://dummy.org/testpage";

    console.log("attempted_location: " + attempted_location);

    // The URL being attempted is
    //put your logic here...
    // if (true) {

    //tell the browser not to respond to the link click
    e.preventDefault();



}

function UrlExists(url, callback) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url);
    http.onreadystatechange = function () {
        if (this.readyState == this.DONE) {
            callback(this.status != 404);
        }
    };
    http.send();
}

function headUrl(url) {
    console.log("##### loadBlob.start: " + url + "  #" + " node: ");
    var p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, true);
            //    xhr.responseType = 'blob';
            //   xhr.onload = () => resolve(xhr.response);

            xhr.onload = function () {
                //resolve(xhr.response);
                var reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function (e) {
                    //        console.log('DataURL:', e.target.result);
                    resolve(e.target.result);
                    //file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                };
            };

            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
            console.log("sent");

        });
    return p.then(function (res) {
        console.log("############### 2.2.3");
        console.log(res);

    });
}

function getBlob(url, j, node) {
    console.log("##### loadBlob.start: " + url + "  #" + j + " node: ");
    console.log(node);
    var p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                //resolve(xhr.response);
                var reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function (e) {
                    //      console.log('DataURL:', e.target.result);
                    resolve(e.target.result);
                    //file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                };
            };

            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
            console.log("sent");

        });
    return p;

}

function getHead(url, j, node) {
    console.log("##### getHead.start: " + url + "  #" + j + " node: " + node);
    // console.log(node);
    try {
        var p = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                // xhr.responseType = 'blob';
                xhr.onload = function () {
                    //resolve(xhr.response);
                    var reader = new FileReader();
                    //              console.log(xhr.response);
                    console.log(xhr);

                    // check for a Location HTTP header in the response
                    console.log(xhr.responseURL);

                    var redirectURL = "";

                    redirectURL = xhr.responseURL;
                    console.log("redirectURL: " + redirectURL);
                    // consider also looking for a html-based redirect in the body of the retruend document.

                    // consider making this recursive, by calling the redirect URL to see if it results in another redirect


                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {
                        console.log(e);

                        console.log("returning : " + redirectURL);
                        resolve(redirectURL);
                    };
                };
                xhr.onerror = () => reject(xhr.statusText);
                console.log("send");
                xhr.send();
            });
        return p;
    } catch (e) {
        console.log(e);
    }

}

function getUrl(url) {
    console.log("##### getUrl.start: " + url);
    // console.log(node);
    try {
        var p = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    //resolve(xhr.response);
                    var reader = new FileReader();
                    console.log(xhr.response);
                    console.log(xhr);

                    // check for a Location HTTP header in the response
                    // console.log(xhr.responseURL);

                    var redirectURL = "";

                    redirectURL = xhr.responseURL;
                    // consider also looking for a html-based redirect in the body of the retruend document.

                    // consider making this recursive, by calling the redirect URL to see if it results in another redirect


                    reader.readAsDataURL(xhr.response);
                    reader.onload = function (e) {

                        resolve(redirectURL);

                    };

                };

                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        return p;
    } catch (e) {
        console.log(e);
    }
}

function runCode_async(node) {

    //runCode(node)


}

//code sample from
//http://www.texsoft.it/index.php?%20m=sw.js.htmltooltip&c=software&l=it

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

//ID of object containing the
function xstooltip_show(tooltipId, parentId, posX, posY) {
    console.log("running: xstooltip_show");
    it = document.getElementById(tooltipId);

    console.log("html of tooltip: " + it.outerHTML);

    //  it = document.createElement("div");
    // it.setAttribute("id",'tooltip_123');
    //  it.setAttribute("class",'xstooltip');
    //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');
    //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');

    //  it.setAttribute("style",'width: 196px; height: 71…px; visibility: hidden;');

    // write content of the message box
    //it.textContent = 'Time spent: 00:00:08<br/>Page viewed: 4<br/>';

    console.log(it);
    console.log("3: ");
    console.log("5: " + it.offsetWidth);
    console.log("6: ");

    if ((it.style.top == '' || it.style.top == 0)
         && (it.style.left == '' || it.style.left == 0)) {
        // need to fixate default size (MSIE problem)
        it.style.width = it.offsetWidth + 'px';
        it.style.height = it.offsetHeight + 'px';

        // identify parent object
        img = document.getElementById(parentId);
        console.log("4: " + img.offsetWidth);
        //img = it.parentNode;
        console.log("parentNode: " + img);
        // if tooltip is too wide, shift left to be within parent
        if (posX + it.offsetWidth > img.offsetWidth)
            posX = img.offsetWidth - it.offsetWidth;
        if (posX < 0)
            posX = 0;

        x = xstooltip_findPosX(img) + posX;
        y = xstooltip_findPosY(img) + posY;

        it.style.top = y + 'px';
        it.style.left = x + 'px';
        console.log("y pos: " + y);
        console.log("x pos: " + x);

    } else {
        console.log("style.top null");
    }

    it.style.visibility = 'visible';
}

//html -  html to display in the tooltip
//tooltipId  - ID of object containing the tooltip
//parentId  -  ID of object to which the tooltip is anchored
function xstooltip_showhtml(inner_html, tooltipId, parentId, posX, posY) {
    console.log("#########################");
    console.log("running: xstooltip_showhtml");
    console.log("running: xstooltip_showhtml(" + inner_html + ", " + tooltipId + ", " + parentId + ", " + posX + ", " + posY + ")");
    var it;

    // (re?)create html of tooltip

    var it2 = document.createElement("div");
    //     it2.setAttribute("id",tooltipId+ '_temp');
    it2.setAttribute("id", tooltipId);
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

    it2.setAttribute("style", 'position: absolute;z-index: 2;top: 0;left: 0;font: normal 12pt sans-serif;padding: 3px;border: solid 0px;background: rgba(0, 175, 256, 0.9);');

    it2.innerHTML = inner_html;

    // insert into  document
    var anchor = document.getElementById(parentId);

    var tooltip_parent = document.getElementById(parentId);
    // add the created tooltip html into the document
    tooltip_parent.appendChild(it2);

    it = it2;

    //  console.log("#### found html of tooltip (outerHTML): " + it.outerHTML);
    // console.log("#### found html of tooltip (innerHTML): " + it.innerHTML);
    //console.log("it.style.top: " + it.style.top);
    //console.log("it2.style.top: " + it2.style.top);
    //console.log("it.style.left: " + it.style.left);
    //console.log("it2.style.left: " + it2.style.left);

    if ((it.style.top == '' || it.style.top == 0 || it.style.top == "0px")
         && (it.style.left == '' || it.style.left == 0 || it.style.left == "0px")) {
        // need to fixate default size (MSIE problem)
        it.style.width = it.offsetWidth + 'px';
        it.style.height = it.offsetHeight + 'px';

        // identify parent object
        img = document.getElementById(parentId);
        //      console.log("4: " + img.offsetWidth);
        //img = it.parentNode;
        //  console.log("parentNode: " + img);
        // if tooltip is too wide, shift left to be within parent
        if (posX + it.offsetWidth > img.offsetWidth)
            posX = img.offsetWidth - it.offsetWidth;
        if (posX < 0)
            posX = 0;

        x = xstooltip_findPosX(img) + posX;
        y = xstooltip_findPosY(img) + posY;

        it.style.top = y + 'px';
        it.style.left = x + 'px';
        //     console.log("y pos: " + y);
        //    console.log("x pos: " + x);

    } else {
        //   console.log("style.top null");
    }

    it.style.visibility = 'visible';
}

function xstooltip_hide(id) {
    it = document.getElementById(id);
    it.style.visibility = 'hidden';
    it.remove();
}

function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

function url_rewrite_step_JSON_path(url, path) {
    console.log("extract path from json");
    return url
}

function url_rewrite_step_qs_param(url, param_name) {

    console.log("get query string parameter");
    var u = "";
    // remove everything behind the parameter
    var reg_exp2 = new RegExp(".*[?&]" + param_name + "=([^&]*).*");
    console.log(reg_exp2);
    u = url.replace(reg_exp2, '$1');
    console.log(u);
    // remove everything infront of the parameter
    //var reg_exp1 = new RegExp(".*[\?&]" + param_name + "=([^&]*)$");
    //	console.log(reg_exp1);
    //	console.log(u);
    //	u = url.replace(reg_exp1, '$1' );


    return u;
}

function ab(event, destination_domain_rules, rulematch) {
    // carry out examination of the link according to the rules
	
	var a_elem = event.target;
 
	var link_url = "";
	link_url = a_elem.getAttribute("href");
	 
	 var new_url = link_url;
    

      // The source based rules apply to any link found on pages matching the rules
      // The destination based rules apply to links/URLs matching the rules.

      // The rules come in tow two forms: rules based on the domain (protocolo, domain, port) and the complete url (protocolo, domain, port, path)
      //  Where the url rules take priority. If a URL has match among the url rules, it is used. If not, then the domain is looked up.

      // Both source and destination rules are applied. With source rules applied first. Links may be rewritten by one source rule, follow by one destination rule.


      // rewrite URLs from the page
      // the rules applies to link found on a matching page/url, regardless of here to go to

      var source_domain_rules = {};
      // look for bit.ly link wherever we can find them.

      // for any link found on www.facebook.com remove the query string parameter "fbclid"
      source_domain_rules['https://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];
      source_domain_rules['http://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];
      source_domain_rules['https://www.linkedin.com/'] = ["regexp(sDtrackingId=[^&]*DDg)"];

      
      
      source_domain_rules['https://www.imdb.com/'] = ["regexp(sDcharDCHARDg)"];

      var source_url_rules = {};

      // rewrite URLs on the page
      // these rules applies to link to URL, regardless of where they are found

      // data structure containing the rules for which URL are to be considered, and what to do with them
      // in priority order. a maximum of one rule can be used.

      // for now, accept a loop-inside-loop-inside-loop arrangement. (shudder!)
      // scope rules for current page domain

      // console.log(document);

      var destination_url_rules = {};

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

      var destination_domain_rules = {};
     
      destination_domain_rules['https://lnkd.in/'] = ["skinny_lookup"];
      destination_domain_rules['https://cutt.ly/'] = ["skinny_lookup"];
      destination_domain_rules['https://tinyurl.com/'] = ["skinny_lookup"];
      destination_domain_rules['https://youtu.be/'] = ["skinny_lookup"];

      // of this domain there is a lot of stuff going in the path-path of the URL. match on some part of this path before engaging in the rewrite
      destination_domain_rules['http://ad.doubleclick.net/'] = ["regexp(sD.*(http[s]*://[^&]*).*D$1Dg)", "regexp(sD\\?.*DDg)"];

      // remove query string from links to www.facebook.com/some-single-phrase
      destination_domain_rules['http://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];
      destination_domain_rules['https://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];

      
      // The rules are to execute bypasses automatically.
      // If a url misses both sets of rules, make no changes to it. On the page, simply add the option to analyse it; On the click event, let the http call proceed uninterrupted

      
      // check for any rule pertaining to this URL

      // start with source-based rules.

     new_url = source_based_rules_enforcement(window.location.href, new_url, source_url_rules, source_domain_rules);
     console.log(new_url);

      // then do destination-based rules
      // note that this is on top of any changes made above. 

     new_url = source_based_rules_enforcement(new_url, new_url, destination_url_rules, destination_domain_rules);
    
     // carry out href rewriting / archiving the previous value
     if (new_url.length > 9 && new_url != link_url) {
     	console.log("replacing: " + link_url + " with " + new_url);
     	a_elem.setAttribute('href', new_url);
     	a_elem.setAttribute('glovebox_archived_original_href', link_url);
     }
     

}


function aa(event, destination_domain_rules, rulematch) {
    // this create the tooltip window next to the link
    // The windows persist until any one of the following things happen


    // 1. User hover over another link
    // 2. User click anywhere on the page
    // 3. user click on a "close window" link inside the tooltip window

    // "rulematch" is a boolean - true means there is a rule match on this URL.
    // "true" means the true endpoint should be looked up automatically and inserted into the link (href attribute)
    // "false" means the user must select this action.

    //    console.log("##test");
    console.log(event);
    //    console.log(destination_domain_rules);
    // console.log(endpoint_url);
    // console.log(elem);
    //console.log(i);


    try {

        // assign a unique identifier to all glovebox nodes so facilitate later addressing
        var uuid;
        //generates random id;
        let guid = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
        //  uuid = guid();
        uuid = "gloveboxtooltip";

        // introduce a small delay here
        const list = [1, 2, 3, 4]
        const task = async() => {
            for (const item of list) {
                await new Promise(r => setTimeout(r, 1000));
                console.log('Yello, D\'oh' + r);
            }
        }
        console.log("1.1.1");
        task();
        console.log("1.1.2");

        // kill all other tooltip windows, before creating a new one for this link


        var endpoint_url = "";
        //   console.log(event.originalTarget);

        /// get node event targets
        var node = null;
        node = event.originalTarget;
        //    console.log(node);


        var testElements = document.getElementsByClassName('test');

        // kill off any other tooltip window(s) created on the same page.

        var s = removeElement(uuid);
        console.log(s);

        var del_it = document.getElementById(uuid);
        console.log("look for existing tooltip");
        console.log(del_it);
        if (del_it) {
            del_it.style.visibility = 'hidden';
            del_it.remove();
        }
        // start lookup


        // setup node in the DOM tree to contain content of message box
        var newGloveboxNode = document.createElement("Glovebox");
        newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily addresable.

        var newGloveboxNode2 = document.createElement("a");
        newGloveboxNode2.setAttribute("href", "http://www.dn.no"); // attach a unique ID to the element to make it more easily addresable.
        //newGloveboxNode2.textContent("http://www.dn.no/NO");
        newGloveboxNode.appendChild(newGloveboxNode2);

        var newTokenNode = document.createElement("glb:token");

        newGloveboxNode.appendChild(newTokenNode);
        newTokenNode.textContent = "some MESSAGE text";

        let insertedNode = node.parentNode.insertBefore(newGloveboxNode, node);

        console.log(node.parentNode);
        console.log(node);
        console.log(insertedNode);
    } catch (e) {
        console.log(e);

    }

    try {
        // (re?)create html of tooltip
        var tooltipId = uuid;
        var it2 = document.createElement("div");
        //     it2.setAttribute("id",tooltipId+ '_temp');
        it2.setAttribute("id", tooltipId);
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

        it2.setAttribute("style", 'position: absolute;z-index: 2;top: 0;left: 0;font: normal 12pt sans-serif;padding: 3px;border: solid 0px;background: rgba(0, 175, 256, 0.9);');

        var posX = 150;
        var posY = 20;

        var it;
        //it2.innerHTML = inner_html;
        it2.innerHTML = '<hr class="gloveboxtooltip">test 001<br/><a href="http://www.dn.no" >a test</a></hr>';

        // where to anchor the tooltip
        var tooltip_parent = node;
        // add the created tooltip html into the document
        tooltip_parent.appendChild(it2);

        it = it2;

        //  console.log("#### found html of tooltip (outerHTML): " + it.outerHTML);
        // console.log("#### found html of tooltip (innerHTML): " + it.innerHTML);
        //console.log("it.style.top: " + it.style.top);
        //console.log("it2.style.top: " + it2.style.top);
        //console.log("it.style.left: " + it.style.left);
        //console.log("it2.style.left: " + it2.style.left);

        if ((it.style.top == '' || it.style.top == 0 || it.style.top == "0px")
             && (it.style.left == '' || it.style.left == 0 || it.style.left == "0px")) {
            // need to fixate default size (MSIE problem)
            it.style.width = it.offsetWidth + 'px';
            it.style.height = it.offsetHeight + 'px';

            // identify parent object
            //      img = document.getElementById(node);
            img = node;
            //      console.log("4: " + img.offsetWidth);
            //img = it.parentNode;
            //  console.log("parentNode: " + img);
            // if tooltip is too wide, shift left to be within parent
            if (posX + it.offsetWidth > img.offsetWidth)
                posX = img.offsetWidth - it.offsetWidth;
            if (posX < 0)
                posX = 0;

            x = xstooltip_findPosX(img) + posX;
            y = xstooltip_findPosY(img) + posY;

            it.style.top = y + 'px';
            it.style.left = x + 'px';
            //     console.log("y pos: " + y);
            //    console.log("x pos: " + x);

        } else {
            //   console.log("style.top null");
        }

        it.style.visibility = 'visible';
    } catch (e) {
        console.log(e);

    }

    //    console.log(event.originalTarget.href);
    endpoint_url = event.originalTarget.href;
    // elem.getAttribute("href");
    // check against the rules for domain namaes

    // The hash table contains the governing rules
    destination_domain_rules

    var regexp_to_abridge_link;
    console.log(endpoint_url.replace(/^http:\/\//i, 'https://'));

    // ok, this isURL matched the rules where we want to lookup the URL to see where it is going - and if it returns a redirect
    console.log("lookup " + endpoint_url);
    // make HEAD request to the URL to see if it meets with a HTTP redirect

    var redirectURL = "";
    var xhr = new XMLHttpRequest();
    // mark "false" to indicate synchronous
    try {
        xhr.open('GET', endpoint_url, false);
        //     xhr.responseType = 'blob';
    } catch (e) {
        console.log(e);
    }
    try {
        xhr.onload = function () {
            console.log(xhr);

            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onload = function (e) {
                console.log('DataURL:', e.target.result);
                //resolve(e.target.result);
                //file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
            };
            // check for a Location HTTP header in the response
            // console.log(xhr.responseURL);
            redirectURL = xhr.responseURL;
        };
    } catch (e) {
        console.log(e);
    }

    xhr.onerror = () => console.log(xhr.statusText);
    try {

        xhr.send();
    } catch (e) {
        console.log(e);
    }

    if (redirectURL.length > 9 && endpoint_url != redirectURL) {
        console.log("replacing: " + endpoint_url + " with " + redirectURL);
        node.setAttribute('href', redirectURL);
        // update status bar to display the new URL
        Window.status = redirectURL;
        //return true;

    } else {
        console.log("invalid returns");
    }

    endpoint_url = redirectURL;
    // the redirect may itself be yet another redirect
    // run through it again
    try {
        xhr = new XMLHttpRequest();
        // mark "false" to indicate synchronous
        xhr.open('GET', endpoint_url, false);
        //     xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            console.log(xhr);

            // check for a Location HTTP header in the response
            // console.log(xhr.responseURL);
            redirectURL = xhr.responseURL;
        };

        //xhr.onerror = () => reject(xhr.statusText);
        xhr.send();
        //console.log(xhr);

        if (redirectURL.length > 9 && endpoint_url != redirectURL) {

            // in case of rule match, proceed with automatic link (href) rewriting.
            if (rulematch) {
                console.log("replacing: " + endpoint_url + " with " + redirectURL);
                node.setAttribute('href', redirectURL);
                node.setAttribute('glovebox_archived_original_href', endpoint_url);

                // update status bar to display the new URL
                Window.status = redirectURL;
            } else {

                console.log("no automatic href replacement");
            }
            return true;

        } else {
            console.log("invalid returns");
        }
    } catch (e) {
        console.log(e);
    }

}



function url_revealer(node) {
    // attach an event listener when a user hower the cursor over a link
    console.log("url_revealer.start");

    // get a list of links (href attribute of "a" tags)
    let elements = document.querySelectorAll('a[href]');

    // loop for a href URL
    try {
        for (let i = 0; i < elements.length; i++) {
            console.log("### checking node " + i);
            var elem = elements[i];

            elem.addEventListener("mouseover", function (elem) {
                console.log("on mouse over action ...");
                console.log(elem);

                //xstooltip_showhtml(elem);
                // var inner_html = 'Time spent: 00:00:08<br><temp>some temporary text</temp>'
                //xstooltip_showhtml(inner_html, uuid + '_tooltip', uuid, 150, 20);
                //aa(elem);
            });

            elem.addEventListener("mouseout", function (elem) {
                console.log("on mouse out action ...");
                //xstooltip_hide(elem);
            });

        }
    } catch (e) {
        console.log(e);
    }
}



function source_based_rules_enforcement(location, linkurl, url_rules, domain_rules) {
    var new_url = "";
    // fall-back is to simply return the submitted value
    new_url = linkurl;

    // lookup rules for this location url
    var protocoldomainportpath = "";
    protocoldomainportpath = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2$3');
    // use this to lookup any rules that may apply to this url
    //console.log("# checking current url (" + protocoldomainportpath + ") against url-specific rules.");
    //console.log(url_rules);
    var rewrite_steps_for_this_URL = [];
    var rewrite_stepcount_for_this_URL = 0;
    try {
        rewrite_steps_for_this_URL = url_rules[protocoldomainportpath];
        if (rewrite_steps_for_this_URL) {
        	if (rewrite_steps_for_this_URL.length > 0){
        		rewrite_stepcount_for_this_URL = rewrite_steps_for_this_URL.length;
        	}
        }
       // console.log("url was found in url-specfic rule store");
       // console.log(rewrite_step_count_for_this_URL);
    } catch (e) {
       // console.log("url not round in url-specfic rule store");
    	rewrite_stepcount_for_this_URL = 0;
    }

    // lookup rules for this location domain

    var protocoldomainport = "";
    protocoldomainport = location.replace(/^(http[s]*:\/\/)([^\/]*\/)([^\?]*).*/i, '$1$2');
    //console.log("# checking current domain (" + protocoldomainport + ") against domain-specific rules:  (" + ")");
   // console.log(domain_rules);
    var rewrite_steps_for_this_domain = [];
    var rewrite_stepcount_for_this_domain = 0;

    // var source_based_rewrite_step_count_for_this_domain = 0;
    try {
    	rewrite_steps_for_this_domain = domain_rules[protocoldomainport];
        //console.log(rewrite_steps_for_this_domain);
        if (rewrite_steps_for_this_domain) {
            //console.log(rewrite_steps_for_this_domain.length);
            if (rewrite_steps_for_this_domain.length > 0){
                rewrite_stepcount_for_this_domain = rewrite_steps_for_this_domain.length;
                //console.log(rewrite_stepcount_for_this_domain) ;
                //console.log("url was found in domain-specfic source rule store");
           }
         }
    } catch (e) {
        //console.log("url not found in domain-specfic rule store");
        source_based_rewrite_stepcount_for_this_domain = 0;
        //console.log(source_based_rewrite_steps_for_this_domain) ;
    }
    //console.log("URL based rewrite rule count: " + rewrite_stepcount_for_this_URL);
    //console.log(rewrite_steps_for_this_URL);
    //console.log("domain based rewrite rule count: " + rewrite_stepcount_for_this_domain);
    //console.log(rewrite_steps_for_this_domain);

    if (rewrite_stepcount_for_this_URL > 0) {
        //console.log("#### there were some URL rule(s)");
        new_url = execute_rule_set(rewrite_steps_for_this_URL, linkurl);
    } else {
        // no url-specific rules found, look for domain specific rules
        if (rewrite_stepcount_for_this_domain > 0) {
            //console.log("#### there were some source domain rule(s)");
            new_url = execute_rule_set(rewrite_steps_for_this_domain, linkurl);
        } else {
            // no domain source rules either
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

function runCode(node) {

    // rewrite URLs on the page


    // data structure containing the rules for which URL are to be considered, and what to do with them
    // in priority order. a maximum of one rule can be used.

    // for now, accept a loop-inside-loop-inside-loop arrangement. (shudder!)
    // scope rules for current page domain

    // console.log(document);

    var destination_url_rules = [];
    // a rule for use at google.com only
    destination_url_rules.push(['^h.*google.com', '.*url=(h.*[^&]*2F[^&]*).*', '$1']);
    // a rule for use at facebook.com only
    destination_url_rules.push(['^h.*facebook.com', '.*url=(h.*[^&]*2F[^&]*).*', '$1']);

    // eliminate "URL shorteners" such as bit.ly
    // rules for which domain names should be considered automatic redirtors that obscure the true endpoint
    // In case the URL is matched, call the URL and determin if the response in an automatic redirect.
    // If so, replace the link with this value so as to avoid calling the redirecting site. Rewrite URL (href attribute in the DOM,if possible.

    var destination_domain_rules = [];
    // look for bit.ly link wherever we can find them.
    destination_domain_rules.push(['.*', 'https://(bit|cutt).ly/']);
    destination_domain_rules.push(['.*', 'ht.*lnkd.in/']);
    destination_domain_rules.push(['.*', 'ht.*tinyurl.com/']);

    // get a list of links (href attribute of "a" tags)
    let elements = document.querySelectorAll('a[href]');

    // stop up the rewrites here
    var rewrite_promises = [];

    var rulematch = false;
    // loop URL
    try {
        for (let i = 0; i < elements.length; i++) {
            // console.log("### checking node " + i);
            var elem = elements[i];
            // check for any rule pertaining to this URL
            for (let j = 0; j < destination_domain_rules.length; j++) {
                // check URL/domain against a regexp for the


                var domain_regexp = new RegExp(destination_domain_rules[j][0]);

                //console.log("checking current location against: " + domain_regexp + " (" + domain_regexp.test(window.location.href) + ")");

                if (domain_regexp.test(endpoint_url)) {
                    // ok, the rule pertains to the URL link at hand

                    var url_regexp = new RegExp(destination_domain_rules[j][1]);

                    var endpoint_url = elem.getAttribute("href");

                    // does the pattern even match the URL ?
                    console.log("attempting target URL match for " + endpoint_url + " on this rule: " + url_regexp + "(" + url_regexp.test(endpoint_url) + ")")

                    if (url_regexp.test(endpoint_url)) {
                        // ok, this isURL matched the rules where we want to lookup the URL to see where it is going - and if it returns a redirect
                        //rulematch = true;

                        // attach event listeners to the link
                        // onHower
                        //  to repsent a tooliå box next to the link with the correct information, and also rewrite the href value
                        // onClick
                        //  intercept the call and determins what is the correct location.

                        // prepare statement that retrieves
                        console.log(elem);
                        const getSrc = function (endpoint_url, j, elem) {
                            return getHead(endpoint_url, j, elem).then(function (v) {
                                console.log(v);
                                console.log(elem);
                                // insert
                                // no valid URL is shorter than 10 characters
                                if (v.length > 9 && endpoint_url != v) {
                                    console.log("replacing: " + endpoint_url + " with " + v);
                                    elem.setAttribute('href', v);
                                    // set a flag that triggers later writing
                                    rulematch = true
                                } else {
                                    console.log("invalid returns");
                                }
                                return 7
                            });
                        }
                        // add the URL to a queue
                        rewrite_promises.push(getSrc(endpoint_url, j, elem));
                        console.log(rewrite_promises);

                    }

                }
            }

        }
    } catch (e) {
        console.log(e);
    }

    if (rulematch) {
        // now have a list of promises and DOM nodes to which they pertain
        // console.log(rewrite_promises);
        // execute on all the promises
        const forLoop = async _ => {

            for (let index = 0; index < rewrite_promises.length; index++) {
                const fruit = rewrite_promises[index]
                    console.log(fruit);
                //const numFruit = await getNumFruit(fruit)
                const numFruit = await fruit();
                console.log(numFruit);
            }

        }
        forLoop().then(function (res) {
            console.log(res);
            console.log("promises forloop completed");

            // return at this point.

        });

    } else {
        //     console.log("no rule match");
    }
}



function run_revealer(node) {

    // URL rewrite and deobfuscation come in two forms, each of which have two different rule sets.
    // There is source and destination based rules.
    // The source based rules apply to any link found on pages matching the rules
    // The destination based rules apply to links/URLs matching the rules.

    // The rules come in tow two forms: rules based on the domain (protocolo, domain, port) and the complete url (protocolo, domain, port, path)
    //  Where the url rules take priority. If a URL has match among the url rules, it is used. If not, then the domain is looked up.

    // Both source and destination rules are applied. With source rules applied first. Links may be rewritten by one source rule, follow by one destination rule.


    // rewrite URLs from the page
    // the rules applies to link found on a matching page/url, regardless of here to go to

    var source_domain_rules = {};
    // look for bit.ly link wherever we can find them.

    // for any link found on www.facebook.com remove the query string parameter "fbclid"
    source_domain_rules['https://www.facebook.com/'] = ["regexp(sDfbclid=[^&]*DDg)"];
    source_domain_rules['https://www.imdb.com/'] = ["regexp(sDcharDCHARDg)"];

    var source_url_rules = {};

    // rewrite URLs on the page
    // these rules applies to link to URL, regardless of where they are found

    // data structure containing the rules for which URL are to be considered, and what to do with them
    // in priority order. a maximum of one rule can be used.

    // for now, accept a loop-inside-loop-inside-loop arrangement. (shudder!)
    // scope rules for current page domain

    // console.log(document);

    var destination_url_rules = {};

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

    var destination_domain_rules = {};
   
    destination_domain_rules['https://lnkd.in/'] = ["skinny_lookup"];
    destination_domain_rules['https://cutt.ly/'] = ["skinny_lookup"];
    destination_domain_rules['https://tinyurl.com/'] = ["skinny_lookup"];
    destination_domain_rules['https://youtu.be/'] = ["skinny_lookup"];

    // of this domain there is a lot of stuff going in the path-path of the URL. match on some part of this path before engaging in the rewrite
    destination_domain_rules['http://ad.doubleclick.net/'] = ["regexp(sD.*(http[s]*://[^&]*).*D$1Dg)", "regexp(sD\\?.*DDg)"];

    // remove query string from links to www.facebook.com/some-single-phrase
    destination_domain_rules['http://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];
    destination_domain_rules['https://www.facebook.com/'] = ["regexp(sD\\?.*DDg)"];

    
    // The rules are to execute bypasses automatically.
    // If a url misses both sets of rules, make no changes to it. On the page, simply add the option to analyse it; On the click event, let the http call proceed uninterrupted


    //console.log(destination_domain_rules);

    // get a list of links (href attribute of "a" tags)
    let elements = document.querySelectorAll('a[href]');

    // stop up the rewrites here
    var rewrite_promises = [];

    var rulematch = false;
    // loop all links found in the DOM
    try {
        for (let i = 0; i < elements.length; i++) {
            // console.log("### checking node " + i);
            var elem = elements[i];
            var link_url = "";
            link_url = elem.getAttribute("href");

            var new_url = "";
            //console.log("link url: " + link_url);
            //console.log("local url: " + window.location.href);
            new_url = link_url;
            // check for any rule pertaining to this URL

            // start with source-based rules.

          //  new_url = source_based_rules_enforcement(window.location.href, new_url, source_url_rules, source_domain_rules);
          //  console.log(new_url);

            // then do destination-based rules
            // note that this is on top of any changes made above. 

            //new_url = source_based_rules_enforcement(new_url, new_url, destination_url_rules, destination_domain_rules);
            //console.log(new_url);

            // carry out href rewriting / archiving the previous value
            if (new_url.length > 9 && new_url != link_url) {
            	console.log("replacing: " + link_url + " with " + new_url);
            	elem.setAttribute('href', new_url);
            	elem.setAttribute('glovebox_archived_original_href', link_url);
            }
            // Add event listener to ensure that the "heavy-lifting" is only performed for links the user is actually interested in.
            // This will save a great deal of proccessing. 
            // Interested is if the user moves the cursor over a link or clicks it. 
            //    // add event listener (maybe)
                elem.addEventListener("mouseover", function (event) {
                    console.log("on mouse over action ...");
                    //ab(event, null, false);
                });
            //    elem.addEventListener("mouseout", function (event) {
            //        console.log("on mouse out action ...");
            //    });

        }
    } catch (e) {
        console.log(e);
    }

}


// Add event listener to document
//listen for link click events at the document level

// diable this for now
if (document.addEventListener) {
    //console.log("# add event listener");
    //document.addEventListener('click', interceptClickEvent);
} else if (document.attachEvent) {
   // document.attachEvent('onclick', interceptClickEvent);
}

// Start the recursion from the body tag.
////replaceText(document.body);
//run_revealer(document.body);




// Now monitor the DOM for additions and substitute new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
               // console.log("change detected");
                // This DOM change was new nodes being added. Run our substitution
                // algorithm on each newly added node.
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const newNode = mutation.addedNodes[i];
                    ////replaceText(newNode);
                    //run_revealer(newNode);
                }
            }
        });
    });
observer.observe(document.body, {
    childList: true,
    subtree: true
});
