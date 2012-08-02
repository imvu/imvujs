

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <title>
  lindenlab / llsd / source &mdash; Bitbucket
</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  
    
  
  <!--[if lt IE 9]>
  <script src="https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/js/old/html5.js"></script>
  <![endif]-->

  <script>
    (function (window) {
      // prevent stray occurrences of `console.log` from causing errors in IE
      var console = window.console || (window.console = {});
      console.log || (console.log = function () {});

      var BB = window.BB || (window.BB = {});
      BB.debug = false;
      BB.cname = false;
      BB.CANON_URL = 'https://bitbucket.org';
      BB.MEDIA_URL = 'https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/';
      BB.images = {
        invitation: 'https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/img/icons/fugue/card_address.png',
        noAvatar: 'https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/img/no_avatar.png'
      };
      BB.user = {"isKbdShortcutsEnabled": true, "isSshEnabled": false};
      BB.user.has = (function () {
        var betaFeatures = [];
        betaFeatures.push('repo2');
        return function (feature) {
          return _.contains(betaFeatures, feature);
        };
      }());
      BB.targetUser = BB.user;
  
    
  
      BB.repo || (BB.repo = {});
  
      
        BB.user.repoPrivilege = null;
      
      
        
          BB.user.accountPrivilege = null;
        
      
      BB.repo.id = 68664;
    
    
      BB.repo.language = null;
      BB.repo.pygmentsLanguage = null;
    
    
      BB.repo.slug = 'llsd';
    
    
      BB.repo.owner = {"username": "lindenlab", "displayName": "Linden Lab", "firstName": "Linden Lab", "avatarUrl": "https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2010/Dec/27/lindenlab-avatar-3776300425-5_avatar.gif", "follows": {"repos": [9236, 14439, 14441, 15311, 17148, 35883, 38061, 63433, 68664, 81728, 81730, 104655, 111483, 111484, 111485, 123037, 155567, 156397, 157128, 157130, 157131, 157132, 165785, 169443, 172353, 174330, 175069, 177356, 177496, 185797, 185802, 185803, 185805, 185808, 185962, 186001, 186007, 186008, 186011, 186015, 186054, 186059, 186062, 186068, 186083, 186128, 187916, 187977, 188016, 188778, 193373, 193972, 197605, 197778, 198559, 199289, 203210, 203362, 232848, 247781, 283689, 334477, 343258, 658373, 658393, 694572, 916998, 928876, 970482, 1020592, 1039226, 1051591, 1051618, 1072856, 1072863, 1072866, 1136321, 1136322, 1136325, 1136334, 1136338, 1176208]}, "isTeam": true, "isSshEnabled": false, "lastName": "", "isKbdShortcutsEnabled": true, "id": 6458};
    
    
      
        
      
    
    
      // Coerce `BB.repo` to a string to get
      // "davidchambers/mango" or whatever.
      BB.repo.toString = function () {
        return BB.cname ? this.slug : '{owner.username}/{slug}'.format(this);
      }
    
    
      BB.changeset = '7d2646cd3f9b'
    
    
  
    }(this));
  </script>

  


  <link rel="stylesheet" href="https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/bun/css/bundle.css"/>



  <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Bitbucket" />
  <link rel="icon" href="https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/img/logo_new.png" type="image/png" />
  <link type="text/plain" rel="author" href="/humans.txt" />


  
  
    <script src="https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/bun/js/bundle.js"></script>
  



</head>

<body id="" class=" ">
  <script>
    if (navigator.userAgent.indexOf(' AppleWebKit/') === -1) {
      $('body').addClass('non-webkit')
    }
    $('body')
      .addClass($.client.os.toLowerCase())
      .addClass($.client.browser.toLowerCase())
  </script>
  <!--[if IE 8]>
  <script>jQuery(document.body).addClass('ie8')</script>
  <![endif]-->
  <!--[if IE 9]>
  <script>jQuery(document.body).addClass('ie9')</script>
  <![endif]-->

  <div id="wrapper">



  <div id="header-wrap">
    <div id="header">
    <ul id="global-nav">
      <li><a class="home" href="http://www.atlassian.com">Atlassian Home</a></li>
      <li><a class="docs" href="http://confluence.atlassian.com/display/BITBUCKET">Documentation</a></li>
      <li><a class="support" href="/support">Support</a></li>
      <li><a class="blog" href="http://blog.bitbucket.org">Blog</a></li>
      <li><a class="forums" href="http://groups.google.com/group/bitbucket-users">Forums</a></li>
    </ul>
    <a href="/" id="logo">Bitbucket by Atlassian</a>

    <div id="main-nav">
    
      <ul class="clearfix">
        <li><a href="/plans">Pricing &amp; signup</a></li>
        <li><a id="explore-link" href="/explore">Explore Bitbucket</a></li>
        <li><a href="/account/signin/?next=/lindenlab/llsd/src/7d2646cd3f9b/js/typedarray.js">Log in</a></li>
        

<li class="search-box">
  
    <form action="/repo/all">
      <input type="search" results="5" autosave="bitbucket-explore-search"
             name="name" id="searchbox"
             placeholder="owner/repo" />
  
  </form>
</li>

      </ul>
    
    </div>

  

    </div>
  </div>

    <div id="header-messages">
  
    
    
    
    
  

    
   </div>



    <div id="content">
      <div id="source">
      
  
  





  <script>
    jQuery(function ($) {
        var cookie = $.cookie,
            cookieOptions, date,
            $content = $('#content'),
            $pane = $('#what-is-bitbucket'),
            $hide = $pane.find('[href="#hide"]').css('display', 'block').hide();

        date = new Date();
        date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
        cookieOptions = { path: '/', expires: date };

        if (cookie('toggle_status') == 'hide') $content.addClass('repo-desc-hidden');

        $('#toggle-repo-content').click(function (event) {
            event.preventDefault();
            $content.toggleClass('repo-desc-hidden');
            cookie('toggle_status', cookie('toggle_status') == 'show' ? 'hide' : 'show', cookieOptions);
        });

        if (!cookie('hide_intro_message')) $pane.show();

        $hide.click(function (event) {
            event.preventDefault();
            cookie('hide_intro_message', true, cookieOptions);
            $pane.slideUp('slow');
        });

        $pane.hover(
            function () { $hide.fadeIn('fast'); },
            function () { $hide.fadeOut('fast'); });

      (function () {
        // Update "recently-viewed-repos" cookie for
        // the "repositories" drop-down.
        var
          id = BB.repo.id,
          cookieName = 'recently-viewed-repos_' + BB.user.id,
          rvr = cookie(cookieName),
          ids = rvr? rvr.split(','): [],
          idx = _.indexOf(ids, '' + id);

        // Remove `id` from `ids` if present.
        if (~idx) ids.splice(idx, 1);

        cookie(
          cookieName,
          // Insert `id` as the first item, then call
          // `join` on the resulting array to produce
          // something like "114694,27542,89002,84570".
          [id].concat(ids.slice(0, 4)).join(),
          {path: '/', expires: 1e6} // "never" expires
        );
      }());
    });
  </script>



    <div id="what-is-bitbucket" class="new-to-bitbucket">
      <h2>Linden Lab <span id="slogan">is sharing code with you</span></h2>
      <img src="https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2010/Dec/27/lindenlab-avatar-3776300425-5_avatar.gif" alt="" class="avatar" />
      <p>Bitbucket is a code hosting site. Unlimited public and private repositories. Free for small teams.</p>
      <div class="primary-action-link signup"><a href="/account/signup/?utm_source=internal&utm_medium=banner&utm_campaign=what_is_bitbucket">Try Bitbucket free</a></div>
      <a href="#hide" title="Don't show this again">Don't show this again</a>
    </div>


<div id="tabs" class="tabs">
  <ul>
    
      <li>
        <a href="/lindenlab/llsd/overview" id="repo-overview-link">Overview</a>
      </li>
    

    
      <li>
        <a href="/lindenlab/llsd/downloads" id="repo-downloads-link">Downloads (<span id="downloads-count">0</span>)</a>
      </li>
    

    
      
    

    
      <li>
        <a href="/lindenlab/llsd/pull-requests" id="repo-pr-link">Pull requests (0)</a>
      </li>
    

    
      <li class="selected">
        
          <a href="/lindenlab/llsd/src" id="repo-source-link">Source</a>
        
      </li>
    

    
      <li>
        <a href="/lindenlab/llsd/changesets" id="repo-commits-link">Commits</a>
      </li>
    

    <li id="wiki-tab" class="dropdown"
      style="display:
          block 
        
      ">
      <a href="/lindenlab/llsd/wiki" id="repo-wiki-link">Wiki</a>
    </li>

    <li id="issues-tab" class="dropdown inertial-hover"
      style="display:
        block 
        
      ">
      <a href="/lindenlab/llsd/issues?status=new&amp;status=open" id="repo-issues-link">Issues (0) &raquo;</a>
      <ul>
        <li><a href="/lindenlab/llsd/issues/new">Create issue</a></li>
        <li><a href="/lindenlab/llsd/issues?status=new">New issues</a></li>
        <li><a href="/lindenlab/llsd/issues?status=new&amp;status=open">Open issues</a></li>
        <li><a href="/lindenlab/llsd/issues?status=duplicate&amp;status=invalid&amp;status=resolved&amp;status=wontfix">Closed issues</a></li>
        
        <li><a href="/lindenlab/llsd/issues">All issues</a></li>
        <li><a href="/lindenlab/llsd/issues/query">Advanced query</a></li>
      </ul>
    </li>

    
  </ul>

  <ul>
    
      <li>
        <a href="/lindenlab/llsd/descendants" id="repo-forks-link">Forks/queues (3)</a>
      </li>
    

    
      <li>
        <a href="/lindenlab/llsd/zealots">Followers (<span id="followers-count">10</span>)</a>
      </li>
    
  </ul>
</div>



 


  <div class="repo-menu" id="repo-menu">
    <ul id="repo-menu-links">
    
    
      <li>
        <a href="/lindenlab/llsd/rss" class="rss" title="RSS feed for llsd">RSS</a>
      </li>

      <li><a id="repo-fork-link" href="/lindenlab/llsd/fork" class="fork">fork</a></li>
      
        
          <li><a id="repo-patch-queue-link" href="/lindenlab/llsd/hack" class="patch-queue">patch queue</a></li>
        
      
      <li>
        <a id="repo-follow-link" rel="nofollow" href="/lindenlab/llsd/follow" class="follow">follow</a>
      </li>
      
          
      
      
        <li class="get-source inertial-hover">
          <a class="source">get source</a>
          <ul class="downloads">
            
              
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.zip">zip</a></li>
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.tar.gz">gz</a></li>
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.tar.bz2">bz2</a></li>
            
          </ul>
        </li>
      
      
    </ul>

  
    <ul class="metadata">
      
      
      
        <li class="branches inertial-hover">branches
          <ul>
            <li class="filter">
              <input type="text" class="dropdown-filter" placeholder="Filter branches" autosave="branch-dropdown-68664"/>
            </li>
            
            <li class="comprev"><a href="/lindenlab/llsd/src/7d2646cd3f9b" title="default">default</a>
              
            </li>
          </ul>
        </li>
      
      
      <li class="tags inertial-hover">tags
        <ul>
          <li class="filter">
            <input type="text" class="dropdown-filter" placeholder="Filter tags" autosave="tags-dropdown-68664"/>
          </li>
          <li class="comprev"><a href="/lindenlab/llsd/src/7d2646cd3f9b">tip</a>
            </li><li class="comprev"><a href="/lindenlab/llsd/src/9b5f436f4db1">v4</a>
            
              <a rel="nofollow" class='menu-compare'
                 href="/lindenlab/llsd/compare/..v4"
                 title="Show changes between v4 and the main branch.">compare</a>
            </li><li class="comprev"><a href="/lindenlab/llsd/src/811e93a3ff04">v3</a>
            
              <a rel="nofollow" class='menu-compare'
                 href="/lindenlab/llsd/compare/..v3"
                 title="Show changes between v3 and the main branch.">compare</a>
            </li><li class="comprev"><a href="/lindenlab/llsd/src/ce6691033070">v2</a>
            
              <a rel="nofollow" class='menu-compare'
                 href="/lindenlab/llsd/compare/..v2"
                 title="Show changes between v2 and the main branch.">compare</a>
            </li><li class="comprev"><a href="/lindenlab/llsd/src/be3522b1e910">v1</a>
            
              <a rel="nofollow" class='menu-compare'
                 href="/lindenlab/llsd/compare/..v1"
                 title="Show changes between v1 and the main branch.">compare</a>
            </li>
        </ul>
      </li>
     
     
      
    </ul>
  
  </div>




<div class="repo-menu" id="repo-desc">
    <ul id="repo-menu-links-mini">
      

      
      <li>
        <a href="/lindenlab/llsd/rss" class="rss" title="RSS feed for llsd"></a>
      </li>

      <li><a href="/lindenlab/llsd/fork" class="fork" title="Fork"></a></li>
      
        
          <li><a href="/lindenlab/llsd/hack" class="patch-queue" title="Patch queue"></a></li>
        
      
      <li>
        <a rel="nofollow" href="/lindenlab/llsd/follow" class="follow">follow</a>
      </li>
      
          
      
      
        <li>
          <a class="source" title="Get source"></a>
          <ul class="downloads">
            
              
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.zip">zip</a></li>
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.tar.gz">gz</a></li>
              <li><a rel="nofollow" href="/lindenlab/llsd/get/7d2646cd3f9b.tar.bz2">bz2</a></li>
            
          </ul>
        </li>
      
    </ul>

    <h3 id="repo-heading" class="public hg">
      <a class="owner-username" href="/lindenlab">lindenlab</a> /
      <a class="repo-name" href="/lindenlab/llsd">llsd</a>
    

    
    </h3>

    
      <p class="repo-desc-description">open source implementations of the LLSD type system in:
- C++
- JavaScript
- Haskell
</p>
    

  <div id="repo-desc-cloneinfo">Clone this repository (size: 425.2 KB):
    <a href="https://bitbucket.org/lindenlab/llsd" class="https">HTTPS</a> /
    <a href="ssh://hg@bitbucket.org/lindenlab/llsd" class="ssh">SSH</a>
    <div id="sourcetree-clone-link" class="clone-in-client mac anonymous help-activated"
         data-desktop-clone-url-ssh="ssh://hg@bitbucket.org/lindenlab/llsd"
         data-desktop-clone-url-https="https://bitbucket.org/lindenlab/llsd">
        /
      <a class="desktop-ssh"
         href="sourcetree://cloneRepo/ssh://hg@bitbucket.org/lindenlab/llsd">SourceTree</a>
      <a class="desktop-https"
         href="sourcetree://cloneRepo/https://bitbucket.org/lindenlab/llsd">SourceTree</a>
    </div>
    
    <pre id="clone-url-https">hg clone https://bitbucket.org/lindenlab/llsd</pre>
    <pre id="clone-url-ssh">hg clone ssh://hg@bitbucket.org/lindenlab/llsd</pre>
    
  </div>

        <a href="#" id="toggle-repo-content"></a>

        

        
          
        

</div>






      
  <div id="source-container">
    

  <div id="source-path">
    <h1>
      <a href="/lindenlab/llsd/src" class="src-pjax">llsd</a> /

  
    
      <a href="/lindenlab/llsd/src/7d2646cd3f9b/js/" class="src-pjax">js</a> /
    
  

  
    
      <span>typedarray.js</span>
    
  

    </h1>
  </div>

  <div class="labels labels-csv">
  
    <dl>
  
    
  
  
    
  
  
    <dt>Branch</dt>
    
      
        <dd class="branch unabridged"><a href="/lindenlab/llsd/changesets/tip/branch(%22default%22)" title="default">default</a></dd>
      
    
  
</dl>

  
  </div>


  
  <div id="source-view">
    <div class="header">
      <ul class="metadata">
        <li><code>7d2646cd3f9b</code></li>
        
          
            <li>628 loc</li>
          
        
        <li>25.4 KB</li>
      </ul>
      <ul class="source-view-links">
        
        <li><a id="embed-link" href="https://bitbucket.org/lindenlab/llsd/src/7d2646cd3f9b/js/typedarray.js?embed=t">embed</a></li>
        
        <li><a href="/lindenlab/llsd/history/js/typedarray.js">history</a></li>
        
        <li><a href="/lindenlab/llsd/annotate/7d2646cd3f9b/js/typedarray.js">annotate</a></li>
        
        <li><a href="/lindenlab/llsd/raw/7d2646cd3f9b/js/typedarray.js">raw</a></li>
        <li>
          <form action="/lindenlab/llsd/diff/js/typedarray.js" class="source-view-form">
          
            <input type="hidden" name="diff2" value="4c80b28c6210" />
            <select name="diff1">
            
              
                <option value="4c80b28c6210">4c80b28c6210</option>
              
            
              
                <option value="6b2f331ea321">6b2f331ea321</option>
              
            
              
                <option value="3f71e1130320">3f71e1130320</option>
              
            
              
                <option value="4e525f811fe1">4e525f811fe1</option>
              
            
              
                <option value="e916a44eacb4">e916a44eacb4</option>
              
            
              
                <option value="340154853d86">340154853d86</option>
              
            
              
                <option value="ab26307d0db8">ab26307d0db8</option>
              
            
              
                <option value="066ee205798b">066ee205798b</option>
              
            
              
                <option value="f4cb28a299cc">f4cb28a299cc</option>
              
            
            </select>
            <input type="submit" value="diff" />
          
          </form>
        </li>
        
      </ul>
    </div>
  
    
      
        <div>
          <table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre><a href="#cl-1">  1</a>
<a href="#cl-2">  2</a>
<a href="#cl-3">  3</a>
<a href="#cl-4">  4</a>
<a href="#cl-5">  5</a>
<a href="#cl-6">  6</a>
<a href="#cl-7">  7</a>
<a href="#cl-8">  8</a>
<a href="#cl-9">  9</a>
<a href="#cl-10"> 10</a>
<a href="#cl-11"> 11</a>
<a href="#cl-12"> 12</a>
<a href="#cl-13"> 13</a>
<a href="#cl-14"> 14</a>
<a href="#cl-15"> 15</a>
<a href="#cl-16"> 16</a>
<a href="#cl-17"> 17</a>
<a href="#cl-18"> 18</a>
<a href="#cl-19"> 19</a>
<a href="#cl-20"> 20</a>
<a href="#cl-21"> 21</a>
<a href="#cl-22"> 22</a>
<a href="#cl-23"> 23</a>
<a href="#cl-24"> 24</a>
<a href="#cl-25"> 25</a>
<a href="#cl-26"> 26</a>
<a href="#cl-27"> 27</a>
<a href="#cl-28"> 28</a>
<a href="#cl-29"> 29</a>
<a href="#cl-30"> 30</a>
<a href="#cl-31"> 31</a>
<a href="#cl-32"> 32</a>
<a href="#cl-33"> 33</a>
<a href="#cl-34"> 34</a>
<a href="#cl-35"> 35</a>
<a href="#cl-36"> 36</a>
<a href="#cl-37"> 37</a>
<a href="#cl-38"> 38</a>
<a href="#cl-39"> 39</a>
<a href="#cl-40"> 40</a>
<a href="#cl-41"> 41</a>
<a href="#cl-42"> 42</a>
<a href="#cl-43"> 43</a>
<a href="#cl-44"> 44</a>
<a href="#cl-45"> 45</a>
<a href="#cl-46"> 46</a>
<a href="#cl-47"> 47</a>
<a href="#cl-48"> 48</a>
<a href="#cl-49"> 49</a>
<a href="#cl-50"> 50</a>
<a href="#cl-51"> 51</a>
<a href="#cl-52"> 52</a>
<a href="#cl-53"> 53</a>
<a href="#cl-54"> 54</a>
<a href="#cl-55"> 55</a>
<a href="#cl-56"> 56</a>
<a href="#cl-57"> 57</a>
<a href="#cl-58"> 58</a>
<a href="#cl-59"> 59</a>
<a href="#cl-60"> 60</a>
<a href="#cl-61"> 61</a>
<a href="#cl-62"> 62</a>
<a href="#cl-63"> 63</a>
<a href="#cl-64"> 64</a>
<a href="#cl-65"> 65</a>
<a href="#cl-66"> 66</a>
<a href="#cl-67"> 67</a>
<a href="#cl-68"> 68</a>
<a href="#cl-69"> 69</a>
<a href="#cl-70"> 70</a>
<a href="#cl-71"> 71</a>
<a href="#cl-72"> 72</a>
<a href="#cl-73"> 73</a>
<a href="#cl-74"> 74</a>
<a href="#cl-75"> 75</a>
<a href="#cl-76"> 76</a>
<a href="#cl-77"> 77</a>
<a href="#cl-78"> 78</a>
<a href="#cl-79"> 79</a>
<a href="#cl-80"> 80</a>
<a href="#cl-81"> 81</a>
<a href="#cl-82"> 82</a>
<a href="#cl-83"> 83</a>
<a href="#cl-84"> 84</a>
<a href="#cl-85"> 85</a>
<a href="#cl-86"> 86</a>
<a href="#cl-87"> 87</a>
<a href="#cl-88"> 88</a>
<a href="#cl-89"> 89</a>
<a href="#cl-90"> 90</a>
<a href="#cl-91"> 91</a>
<a href="#cl-92"> 92</a>
<a href="#cl-93"> 93</a>
<a href="#cl-94"> 94</a>
<a href="#cl-95"> 95</a>
<a href="#cl-96"> 96</a>
<a href="#cl-97"> 97</a>
<a href="#cl-98"> 98</a>
<a href="#cl-99"> 99</a>
<a href="#cl-100">100</a>
<a href="#cl-101">101</a>
<a href="#cl-102">102</a>
<a href="#cl-103">103</a>
<a href="#cl-104">104</a>
<a href="#cl-105">105</a>
<a href="#cl-106">106</a>
<a href="#cl-107">107</a>
<a href="#cl-108">108</a>
<a href="#cl-109">109</a>
<a href="#cl-110">110</a>
<a href="#cl-111">111</a>
<a href="#cl-112">112</a>
<a href="#cl-113">113</a>
<a href="#cl-114">114</a>
<a href="#cl-115">115</a>
<a href="#cl-116">116</a>
<a href="#cl-117">117</a>
<a href="#cl-118">118</a>
<a href="#cl-119">119</a>
<a href="#cl-120">120</a>
<a href="#cl-121">121</a>
<a href="#cl-122">122</a>
<a href="#cl-123">123</a>
<a href="#cl-124">124</a>
<a href="#cl-125">125</a>
<a href="#cl-126">126</a>
<a href="#cl-127">127</a>
<a href="#cl-128">128</a>
<a href="#cl-129">129</a>
<a href="#cl-130">130</a>
<a href="#cl-131">131</a>
<a href="#cl-132">132</a>
<a href="#cl-133">133</a>
<a href="#cl-134">134</a>
<a href="#cl-135">135</a>
<a href="#cl-136">136</a>
<a href="#cl-137">137</a>
<a href="#cl-138">138</a>
<a href="#cl-139">139</a>
<a href="#cl-140">140</a>
<a href="#cl-141">141</a>
<a href="#cl-142">142</a>
<a href="#cl-143">143</a>
<a href="#cl-144">144</a>
<a href="#cl-145">145</a>
<a href="#cl-146">146</a>
<a href="#cl-147">147</a>
<a href="#cl-148">148</a>
<a href="#cl-149">149</a>
<a href="#cl-150">150</a>
<a href="#cl-151">151</a>
<a href="#cl-152">152</a>
<a href="#cl-153">153</a>
<a href="#cl-154">154</a>
<a href="#cl-155">155</a>
<a href="#cl-156">156</a>
<a href="#cl-157">157</a>
<a href="#cl-158">158</a>
<a href="#cl-159">159</a>
<a href="#cl-160">160</a>
<a href="#cl-161">161</a>
<a href="#cl-162">162</a>
<a href="#cl-163">163</a>
<a href="#cl-164">164</a>
<a href="#cl-165">165</a>
<a href="#cl-166">166</a>
<a href="#cl-167">167</a>
<a href="#cl-168">168</a>
<a href="#cl-169">169</a>
<a href="#cl-170">170</a>
<a href="#cl-171">171</a>
<a href="#cl-172">172</a>
<a href="#cl-173">173</a>
<a href="#cl-174">174</a>
<a href="#cl-175">175</a>
<a href="#cl-176">176</a>
<a href="#cl-177">177</a>
<a href="#cl-178">178</a>
<a href="#cl-179">179</a>
<a href="#cl-180">180</a>
<a href="#cl-181">181</a>
<a href="#cl-182">182</a>
<a href="#cl-183">183</a>
<a href="#cl-184">184</a>
<a href="#cl-185">185</a>
<a href="#cl-186">186</a>
<a href="#cl-187">187</a>
<a href="#cl-188">188</a>
<a href="#cl-189">189</a>
<a href="#cl-190">190</a>
<a href="#cl-191">191</a>
<a href="#cl-192">192</a>
<a href="#cl-193">193</a>
<a href="#cl-194">194</a>
<a href="#cl-195">195</a>
<a href="#cl-196">196</a>
<a href="#cl-197">197</a>
<a href="#cl-198">198</a>
<a href="#cl-199">199</a>
<a href="#cl-200">200</a>
<a href="#cl-201">201</a>
<a href="#cl-202">202</a>
<a href="#cl-203">203</a>
<a href="#cl-204">204</a>
<a href="#cl-205">205</a>
<a href="#cl-206">206</a>
<a href="#cl-207">207</a>
<a href="#cl-208">208</a>
<a href="#cl-209">209</a>
<a href="#cl-210">210</a>
<a href="#cl-211">211</a>
<a href="#cl-212">212</a>
<a href="#cl-213">213</a>
<a href="#cl-214">214</a>
<a href="#cl-215">215</a>
<a href="#cl-216">216</a>
<a href="#cl-217">217</a>
<a href="#cl-218">218</a>
<a href="#cl-219">219</a>
<a href="#cl-220">220</a>
<a href="#cl-221">221</a>
<a href="#cl-222">222</a>
<a href="#cl-223">223</a>
<a href="#cl-224">224</a>
<a href="#cl-225">225</a>
<a href="#cl-226">226</a>
<a href="#cl-227">227</a>
<a href="#cl-228">228</a>
<a href="#cl-229">229</a>
<a href="#cl-230">230</a>
<a href="#cl-231">231</a>
<a href="#cl-232">232</a>
<a href="#cl-233">233</a>
<a href="#cl-234">234</a>
<a href="#cl-235">235</a>
<a href="#cl-236">236</a>
<a href="#cl-237">237</a>
<a href="#cl-238">238</a>
<a href="#cl-239">239</a>
<a href="#cl-240">240</a>
<a href="#cl-241">241</a>
<a href="#cl-242">242</a>
<a href="#cl-243">243</a>
<a href="#cl-244">244</a>
<a href="#cl-245">245</a>
<a href="#cl-246">246</a>
<a href="#cl-247">247</a>
<a href="#cl-248">248</a>
<a href="#cl-249">249</a>
<a href="#cl-250">250</a>
<a href="#cl-251">251</a>
<a href="#cl-252">252</a>
<a href="#cl-253">253</a>
<a href="#cl-254">254</a>
<a href="#cl-255">255</a>
<a href="#cl-256">256</a>
<a href="#cl-257">257</a>
<a href="#cl-258">258</a>
<a href="#cl-259">259</a>
<a href="#cl-260">260</a>
<a href="#cl-261">261</a>
<a href="#cl-262">262</a>
<a href="#cl-263">263</a>
<a href="#cl-264">264</a>
<a href="#cl-265">265</a>
<a href="#cl-266">266</a>
<a href="#cl-267">267</a>
<a href="#cl-268">268</a>
<a href="#cl-269">269</a>
<a href="#cl-270">270</a>
<a href="#cl-271">271</a>
<a href="#cl-272">272</a>
<a href="#cl-273">273</a>
<a href="#cl-274">274</a>
<a href="#cl-275">275</a>
<a href="#cl-276">276</a>
<a href="#cl-277">277</a>
<a href="#cl-278">278</a>
<a href="#cl-279">279</a>
<a href="#cl-280">280</a>
<a href="#cl-281">281</a>
<a href="#cl-282">282</a>
<a href="#cl-283">283</a>
<a href="#cl-284">284</a>
<a href="#cl-285">285</a>
<a href="#cl-286">286</a>
<a href="#cl-287">287</a>
<a href="#cl-288">288</a>
<a href="#cl-289">289</a>
<a href="#cl-290">290</a>
<a href="#cl-291">291</a>
<a href="#cl-292">292</a>
<a href="#cl-293">293</a>
<a href="#cl-294">294</a>
<a href="#cl-295">295</a>
<a href="#cl-296">296</a>
<a href="#cl-297">297</a>
<a href="#cl-298">298</a>
<a href="#cl-299">299</a>
<a href="#cl-300">300</a>
<a href="#cl-301">301</a>
<a href="#cl-302">302</a>
<a href="#cl-303">303</a>
<a href="#cl-304">304</a>
<a href="#cl-305">305</a>
<a href="#cl-306">306</a>
<a href="#cl-307">307</a>
<a href="#cl-308">308</a>
<a href="#cl-309">309</a>
<a href="#cl-310">310</a>
<a href="#cl-311">311</a>
<a href="#cl-312">312</a>
<a href="#cl-313">313</a>
<a href="#cl-314">314</a>
<a href="#cl-315">315</a>
<a href="#cl-316">316</a>
<a href="#cl-317">317</a>
<a href="#cl-318">318</a>
<a href="#cl-319">319</a>
<a href="#cl-320">320</a>
<a href="#cl-321">321</a>
<a href="#cl-322">322</a>
<a href="#cl-323">323</a>
<a href="#cl-324">324</a>
<a href="#cl-325">325</a>
<a href="#cl-326">326</a>
<a href="#cl-327">327</a>
<a href="#cl-328">328</a>
<a href="#cl-329">329</a>
<a href="#cl-330">330</a>
<a href="#cl-331">331</a>
<a href="#cl-332">332</a>
<a href="#cl-333">333</a>
<a href="#cl-334">334</a>
<a href="#cl-335">335</a>
<a href="#cl-336">336</a>
<a href="#cl-337">337</a>
<a href="#cl-338">338</a>
<a href="#cl-339">339</a>
<a href="#cl-340">340</a>
<a href="#cl-341">341</a>
<a href="#cl-342">342</a>
<a href="#cl-343">343</a>
<a href="#cl-344">344</a>
<a href="#cl-345">345</a>
<a href="#cl-346">346</a>
<a href="#cl-347">347</a>
<a href="#cl-348">348</a>
<a href="#cl-349">349</a>
<a href="#cl-350">350</a>
<a href="#cl-351">351</a>
<a href="#cl-352">352</a>
<a href="#cl-353">353</a>
<a href="#cl-354">354</a>
<a href="#cl-355">355</a>
<a href="#cl-356">356</a>
<a href="#cl-357">357</a>
<a href="#cl-358">358</a>
<a href="#cl-359">359</a>
<a href="#cl-360">360</a>
<a href="#cl-361">361</a>
<a href="#cl-362">362</a>
<a href="#cl-363">363</a>
<a href="#cl-364">364</a>
<a href="#cl-365">365</a>
<a href="#cl-366">366</a>
<a href="#cl-367">367</a>
<a href="#cl-368">368</a>
<a href="#cl-369">369</a>
<a href="#cl-370">370</a>
<a href="#cl-371">371</a>
<a href="#cl-372">372</a>
<a href="#cl-373">373</a>
<a href="#cl-374">374</a>
<a href="#cl-375">375</a>
<a href="#cl-376">376</a>
<a href="#cl-377">377</a>
<a href="#cl-378">378</a>
<a href="#cl-379">379</a>
<a href="#cl-380">380</a>
<a href="#cl-381">381</a>
<a href="#cl-382">382</a>
<a href="#cl-383">383</a>
<a href="#cl-384">384</a>
<a href="#cl-385">385</a>
<a href="#cl-386">386</a>
<a href="#cl-387">387</a>
<a href="#cl-388">388</a>
<a href="#cl-389">389</a>
<a href="#cl-390">390</a>
<a href="#cl-391">391</a>
<a href="#cl-392">392</a>
<a href="#cl-393">393</a>
<a href="#cl-394">394</a>
<a href="#cl-395">395</a>
<a href="#cl-396">396</a>
<a href="#cl-397">397</a>
<a href="#cl-398">398</a>
<a href="#cl-399">399</a>
<a href="#cl-400">400</a>
<a href="#cl-401">401</a>
<a href="#cl-402">402</a>
<a href="#cl-403">403</a>
<a href="#cl-404">404</a>
<a href="#cl-405">405</a>
<a href="#cl-406">406</a>
<a href="#cl-407">407</a>
<a href="#cl-408">408</a>
<a href="#cl-409">409</a>
<a href="#cl-410">410</a>
<a href="#cl-411">411</a>
<a href="#cl-412">412</a>
<a href="#cl-413">413</a>
<a href="#cl-414">414</a>
<a href="#cl-415">415</a>
<a href="#cl-416">416</a>
<a href="#cl-417">417</a>
<a href="#cl-418">418</a>
<a href="#cl-419">419</a>
<a href="#cl-420">420</a>
<a href="#cl-421">421</a>
<a href="#cl-422">422</a>
<a href="#cl-423">423</a>
<a href="#cl-424">424</a>
<a href="#cl-425">425</a>
<a href="#cl-426">426</a>
<a href="#cl-427">427</a>
<a href="#cl-428">428</a>
<a href="#cl-429">429</a>
<a href="#cl-430">430</a>
<a href="#cl-431">431</a>
<a href="#cl-432">432</a>
<a href="#cl-433">433</a>
<a href="#cl-434">434</a>
<a href="#cl-435">435</a>
<a href="#cl-436">436</a>
<a href="#cl-437">437</a>
<a href="#cl-438">438</a>
<a href="#cl-439">439</a>
<a href="#cl-440">440</a>
<a href="#cl-441">441</a>
<a href="#cl-442">442</a>
<a href="#cl-443">443</a>
<a href="#cl-444">444</a>
<a href="#cl-445">445</a>
<a href="#cl-446">446</a>
<a href="#cl-447">447</a>
<a href="#cl-448">448</a>
<a href="#cl-449">449</a>
<a href="#cl-450">450</a>
<a href="#cl-451">451</a>
<a href="#cl-452">452</a>
<a href="#cl-453">453</a>
<a href="#cl-454">454</a>
<a href="#cl-455">455</a>
<a href="#cl-456">456</a>
<a href="#cl-457">457</a>
<a href="#cl-458">458</a>
<a href="#cl-459">459</a>
<a href="#cl-460">460</a>
<a href="#cl-461">461</a>
<a href="#cl-462">462</a>
<a href="#cl-463">463</a>
<a href="#cl-464">464</a>
<a href="#cl-465">465</a>
<a href="#cl-466">466</a>
<a href="#cl-467">467</a>
<a href="#cl-468">468</a>
<a href="#cl-469">469</a>
<a href="#cl-470">470</a>
<a href="#cl-471">471</a>
<a href="#cl-472">472</a>
<a href="#cl-473">473</a>
<a href="#cl-474">474</a>
<a href="#cl-475">475</a>
<a href="#cl-476">476</a>
<a href="#cl-477">477</a>
<a href="#cl-478">478</a>
<a href="#cl-479">479</a>
<a href="#cl-480">480</a>
<a href="#cl-481">481</a>
<a href="#cl-482">482</a>
<a href="#cl-483">483</a>
<a href="#cl-484">484</a>
<a href="#cl-485">485</a>
<a href="#cl-486">486</a>
<a href="#cl-487">487</a>
<a href="#cl-488">488</a>
<a href="#cl-489">489</a>
<a href="#cl-490">490</a>
<a href="#cl-491">491</a>
<a href="#cl-492">492</a>
<a href="#cl-493">493</a>
<a href="#cl-494">494</a>
<a href="#cl-495">495</a>
<a href="#cl-496">496</a>
<a href="#cl-497">497</a>
<a href="#cl-498">498</a>
<a href="#cl-499">499</a>
<a href="#cl-500">500</a>
<a href="#cl-501">501</a>
<a href="#cl-502">502</a>
<a href="#cl-503">503</a>
<a href="#cl-504">504</a>
<a href="#cl-505">505</a>
<a href="#cl-506">506</a>
<a href="#cl-507">507</a>
<a href="#cl-508">508</a>
<a href="#cl-509">509</a>
<a href="#cl-510">510</a>
<a href="#cl-511">511</a>
<a href="#cl-512">512</a>
<a href="#cl-513">513</a>
<a href="#cl-514">514</a>
<a href="#cl-515">515</a>
<a href="#cl-516">516</a>
<a href="#cl-517">517</a>
<a href="#cl-518">518</a>
<a href="#cl-519">519</a>
<a href="#cl-520">520</a>
<a href="#cl-521">521</a>
<a href="#cl-522">522</a>
<a href="#cl-523">523</a>
<a href="#cl-524">524</a>
<a href="#cl-525">525</a>
<a href="#cl-526">526</a>
<a href="#cl-527">527</a>
<a href="#cl-528">528</a>
<a href="#cl-529">529</a>
<a href="#cl-530">530</a>
<a href="#cl-531">531</a>
<a href="#cl-532">532</a>
<a href="#cl-533">533</a>
<a href="#cl-534">534</a>
<a href="#cl-535">535</a>
<a href="#cl-536">536</a>
<a href="#cl-537">537</a>
<a href="#cl-538">538</a>
<a href="#cl-539">539</a>
<a href="#cl-540">540</a>
<a href="#cl-541">541</a>
<a href="#cl-542">542</a>
<a href="#cl-543">543</a>
<a href="#cl-544">544</a>
<a href="#cl-545">545</a>
<a href="#cl-546">546</a>
<a href="#cl-547">547</a>
<a href="#cl-548">548</a>
<a href="#cl-549">549</a>
<a href="#cl-550">550</a>
<a href="#cl-551">551</a>
<a href="#cl-552">552</a>
<a href="#cl-553">553</a>
<a href="#cl-554">554</a>
<a href="#cl-555">555</a>
<a href="#cl-556">556</a>
<a href="#cl-557">557</a>
<a href="#cl-558">558</a>
<a href="#cl-559">559</a>
<a href="#cl-560">560</a>
<a href="#cl-561">561</a>
<a href="#cl-562">562</a>
<a href="#cl-563">563</a>
<a href="#cl-564">564</a>
<a href="#cl-565">565</a>
<a href="#cl-566">566</a>
<a href="#cl-567">567</a>
<a href="#cl-568">568</a>
<a href="#cl-569">569</a>
<a href="#cl-570">570</a>
<a href="#cl-571">571</a>
<a href="#cl-572">572</a>
<a href="#cl-573">573</a>
<a href="#cl-574">574</a>
<a href="#cl-575">575</a>
<a href="#cl-576">576</a>
<a href="#cl-577">577</a>
<a href="#cl-578">578</a>
<a href="#cl-579">579</a>
<a href="#cl-580">580</a>
<a href="#cl-581">581</a>
<a href="#cl-582">582</a>
<a href="#cl-583">583</a>
<a href="#cl-584">584</a>
<a href="#cl-585">585</a>
<a href="#cl-586">586</a>
<a href="#cl-587">587</a>
<a href="#cl-588">588</a>
<a href="#cl-589">589</a>
<a href="#cl-590">590</a>
<a href="#cl-591">591</a>
<a href="#cl-592">592</a>
<a href="#cl-593">593</a>
<a href="#cl-594">594</a>
<a href="#cl-595">595</a>
<a href="#cl-596">596</a>
<a href="#cl-597">597</a>
<a href="#cl-598">598</a>
<a href="#cl-599">599</a>
<a href="#cl-600">600</a>
<a href="#cl-601">601</a>
<a href="#cl-602">602</a>
<a href="#cl-603">603</a>
<a href="#cl-604">604</a>
<a href="#cl-605">605</a>
<a href="#cl-606">606</a>
<a href="#cl-607">607</a>
<a href="#cl-608">608</a>
<a href="#cl-609">609</a>
<a href="#cl-610">610</a>
<a href="#cl-611">611</a>
<a href="#cl-612">612</a>
<a href="#cl-613">613</a>
<a href="#cl-614">614</a>
<a href="#cl-615">615</a>
<a href="#cl-616">616</a>
<a href="#cl-617">617</a>
<a href="#cl-618">618</a>
<a href="#cl-619">619</a>
<a href="#cl-620">620</a>
<a href="#cl-621">621</a>
<a href="#cl-622">622</a>
<a href="#cl-623">623</a>
<a href="#cl-624">624</a>
<a href="#cl-625">625</a>
<a href="#cl-626">626</a>
<a href="#cl-627">627</a>
<a href="#cl-628">628</a>
</pre></div></td><td class="code"><div class="highlight"><pre><a name="cl-1"></a><span class="cm">/*</span>
<a name="cl-2"></a><span class="cm">$LicenseInfo:firstyear=2010&amp;license=mit$</span>
<a name="cl-3"></a>
<a name="cl-4"></a><span class="cm">Copyright (c) 2010, Linden Research, Inc.</span>
<a name="cl-5"></a>
<a name="cl-6"></a><span class="cm">Permission is hereby granted, free of charge, to any person obtaining a copy</span>
<a name="cl-7"></a><span class="cm">of this software and associated documentation files (the &quot;Software&quot;), to deal</span>
<a name="cl-8"></a><span class="cm">in the Software without restriction, including without limitation the rights</span>
<a name="cl-9"></a><span class="cm">to use, copy, modify, merge, publish, distribute, sublicense, and/or sell</span>
<a name="cl-10"></a><span class="cm">copies of the Software, and to permit persons to whom the Software is</span>
<a name="cl-11"></a><span class="cm">furnished to do so, subject to the following conditions:</span>
<a name="cl-12"></a>
<a name="cl-13"></a><span class="cm">The above copyright notice and this permission notice shall be included in</span>
<a name="cl-14"></a><span class="cm">all copies or substantial portions of the Software.</span>
<a name="cl-15"></a>
<a name="cl-16"></a><span class="cm">THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR</span>
<a name="cl-17"></a><span class="cm">IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,</span>
<a name="cl-18"></a><span class="cm">FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE</span>
<a name="cl-19"></a><span class="cm">AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER</span>
<a name="cl-20"></a><span class="cm">LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,</span>
<a name="cl-21"></a><span class="cm">OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN</span>
<a name="cl-22"></a><span class="cm">THE SOFTWARE.</span>
<a name="cl-23"></a><span class="cm">$/LicenseInfo$</span>
<a name="cl-24"></a><span class="cm">*/</span>
<a name="cl-25"></a><span class="cm">/*global document*/</span>
<a name="cl-26"></a>
<a name="cl-27"></a><span class="c1">//</span>
<a name="cl-28"></a><span class="c1">// ES3/ES5 implementation of the Krhonos TypedArray Working Draft (work in progress):</span>
<a name="cl-29"></a><span class="c1">//   Ref: https://cvs.khronos.org/svn/repos/registry/trunk/public/webgl/doc/spec/TypedArray-spec.html</span>
<a name="cl-30"></a><span class="c1">//   Date: 2011-02-01</span>
<a name="cl-31"></a><span class="c1">//</span>
<a name="cl-32"></a><span class="c1">// Variations:</span>
<a name="cl-33"></a><span class="c1">//  * Float/Double -&gt; Float32/Float64, per WebGL-Public mailing list conversations (post 5/17)</span>
<a name="cl-34"></a><span class="c1">//  * Allows typed_array.get/set() as alias for subscripts (typed_array[])</span>
<a name="cl-35"></a>
<a name="cl-36"></a><span class="kd">var</span> <span class="nx">ArrayBuffer</span><span class="p">,</span> <span class="nx">ArrayBufferView</span><span class="p">,</span>
<a name="cl-37"></a>    <span class="nx">Int8Array</span><span class="p">,</span> <span class="nx">Uint8Array</span><span class="p">,</span> <span class="nx">Int16Array</span><span class="p">,</span> <span class="nx">Uint16Array</span><span class="p">,</span> <span class="nx">Int32Array</span><span class="p">,</span> <span class="nx">Uint32Array</span><span class="p">,</span> <span class="nx">Float32Array</span><span class="p">,</span> <span class="nx">Float64Array</span><span class="p">,</span>
<a name="cl-38"></a>    <span class="nx">DataView</span><span class="p">;</span>
<a name="cl-39"></a>
<a name="cl-40"></a><span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
<a name="cl-41"></a>    <span class="s2">&quot;use strict&quot;</span><span class="p">;</span>
<a name="cl-42"></a>    <span class="cm">/*jslint bitwise: false, nomen: false */</span>
<a name="cl-43"></a>
<a name="cl-44"></a>    <span class="c1">// Approximations of internal ECMAScript conversion functions</span>
<a name="cl-45"></a>    <span class="kd">var</span> <span class="nx">ECMAScript</span> <span class="o">=</span> <span class="p">{</span>
<a name="cl-46"></a>        <span class="nx">ToInt32</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">v</span> <span class="o">&gt;&gt;</span> <span class="mi">0</span><span class="p">;</span> <span class="p">},</span>
<a name="cl-47"></a>        <span class="nx">ToUint32</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">v</span> <span class="o">&gt;&gt;&gt;</span> <span class="mi">0</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-48"></a>    <span class="p">};</span>
<a name="cl-49"></a>
<a name="cl-50"></a>    <span class="c1">// Raise an INDEX_SIZE_ERR event - intentionally induces a DOM error</span>
<a name="cl-51"></a>    <span class="kd">function</span> <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">()</span> <span class="p">{</span>
<a name="cl-52"></a>        <span class="k">if</span> <span class="p">(</span><span class="nb">document</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-53"></a>            <span class="c1">// raises DOMException(INDEX_SIZE_ERR)</span>
<a name="cl-54"></a>            <span class="nb">document</span><span class="p">.</span><span class="nx">createTextNode</span><span class="p">(</span><span class="s2">&quot;&quot;</span><span class="p">).</span><span class="nx">splitText</span><span class="p">(</span><span class="mi">1</span><span class="p">);</span>
<a name="cl-55"></a>        <span class="p">}</span>
<a name="cl-56"></a>        <span class="k">throw</span> <span class="k">new</span> <span class="nx">RangeError</span><span class="p">(</span><span class="s2">&quot;INDEX_SIZE_ERR&quot;</span><span class="p">);</span>
<a name="cl-57"></a>    <span class="p">}</span>
<a name="cl-58"></a>
<a name="cl-59"></a>    <span class="c1">// ES5: lock down object properties</span>
<a name="cl-60"></a>    <span class="kd">function</span> <span class="nx">configureProperties</span><span class="p">(</span><span class="nx">obj</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-61"></a>        <span class="k">if</span> <span class="p">(</span><span class="nb">Object</span><span class="p">.</span><span class="nx">getOwnPropertyNames</span> <span class="o">&amp;&amp;</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-62"></a>            <span class="kd">var</span> <span class="nx">props</span> <span class="o">=</span> <span class="nb">Object</span><span class="p">.</span><span class="nx">getOwnPropertyNames</span><span class="p">(</span><span class="nx">obj</span><span class="p">),</span> <span class="nx">i</span><span class="p">;</span>
<a name="cl-63"></a>            <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">props</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-64"></a>                <span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span><span class="p">(</span><span class="nx">obj</span><span class="p">,</span> <span class="nx">props</span><span class="p">[</span><span class="nx">i</span><span class="p">],</span> <span class="p">{</span>
<a name="cl-65"></a>                    <span class="nx">value</span><span class="o">:</span> <span class="nx">obj</span><span class="p">[</span><span class="nx">props</span><span class="p">[</span><span class="nx">i</span><span class="p">]],</span>
<a name="cl-66"></a>                    <span class="nx">writable</span><span class="o">:</span> <span class="kc">false</span><span class="p">,</span>
<a name="cl-67"></a>                    <span class="nx">enumerable</span><span class="o">:</span> <span class="kc">false</span><span class="p">,</span>
<a name="cl-68"></a>                    <span class="nx">configurable</span><span class="o">:</span> <span class="kc">false</span>
<a name="cl-69"></a>                <span class="p">});</span>
<a name="cl-70"></a>            <span class="p">}</span>
<a name="cl-71"></a>        <span class="p">}</span>
<a name="cl-72"></a>    <span class="p">}</span>
<a name="cl-73"></a>
<a name="cl-74"></a>    <span class="c1">// emulate ES5 getter/setter API using legacy APIs</span>
<a name="cl-75"></a>    <span class="c1">// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx</span>
<a name="cl-76"></a>    <span class="k">if</span> <span class="p">(</span><span class="nb">Object</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">__defineGetter__</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-77"></a>        <span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">obj</span><span class="p">,</span> <span class="nx">prop</span><span class="p">,</span> <span class="nx">desc</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-78"></a>            <span class="k">if</span> <span class="p">(</span><span class="nx">desc</span><span class="p">.</span><span class="nx">hasOwnProperty</span><span class="p">(</span><span class="s1">&#39;get&#39;</span><span class="p">))</span> <span class="p">{</span> <span class="nx">obj</span><span class="p">.</span><span class="nx">__defineGetter__</span><span class="p">(</span><span class="nx">prop</span><span class="p">,</span> <span class="nx">desc</span><span class="p">.</span><span class="nx">get</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-79"></a>            <span class="k">if</span> <span class="p">(</span><span class="nx">desc</span><span class="p">.</span><span class="nx">hasOwnProperty</span><span class="p">(</span><span class="s1">&#39;set&#39;</span><span class="p">))</span> <span class="p">{</span> <span class="nx">obj</span><span class="p">.</span><span class="nx">__defineSetter__</span><span class="p">(</span><span class="nx">prop</span><span class="p">,</span> <span class="nx">desc</span><span class="p">.</span><span class="nx">set</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-80"></a>        <span class="p">};</span>
<a name="cl-81"></a>    <span class="p">}</span>
<a name="cl-82"></a>
<a name="cl-83"></a>    <span class="c1">// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)</span>
<a name="cl-84"></a>    <span class="c1">// for index in 0 ... obj.length</span>
<a name="cl-85"></a>    <span class="kd">function</span> <span class="nx">makeArrayAccessors</span><span class="p">(</span><span class="nx">obj</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-86"></a>        <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-87"></a>
<a name="cl-88"></a>        <span class="kd">function</span> <span class="nx">makeArrayAccessor</span><span class="p">(</span><span class="nx">index</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-89"></a>            <span class="nb">Object</span><span class="p">.</span><span class="nx">defineProperty</span><span class="p">(</span><span class="nx">obj</span><span class="p">,</span> <span class="nx">index</span><span class="p">,</span> <span class="p">{</span>
<a name="cl-90"></a>                <span class="s1">&#39;get&#39;</span><span class="o">:</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">obj</span><span class="p">.</span><span class="nx">_getter</span><span class="p">(</span><span class="nx">index</span><span class="p">);</span> <span class="p">},</span>
<a name="cl-91"></a>                <span class="s1">&#39;set&#39;</span><span class="o">:</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="p">{</span> <span class="nx">obj</span><span class="p">.</span><span class="nx">_setter</span><span class="p">(</span><span class="nx">index</span><span class="p">,</span> <span class="nx">v</span><span class="p">);</span> <span class="p">},</span>
<a name="cl-92"></a>                <span class="nx">enumerable</span><span class="o">:</span> <span class="kc">true</span><span class="p">,</span>
<a name="cl-93"></a>                <span class="nx">configurable</span><span class="o">:</span> <span class="kc">false</span>
<a name="cl-94"></a>            <span class="p">});</span>
<a name="cl-95"></a>        <span class="p">}</span>
<a name="cl-96"></a>
<a name="cl-97"></a>        <span class="kd">var</span> <span class="nx">i</span><span class="p">;</span>
<a name="cl-98"></a>        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">obj</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-99"></a>            <span class="nx">makeArrayAccessor</span><span class="p">(</span><span class="nx">i</span><span class="p">);</span>
<a name="cl-100"></a>        <span class="p">}</span>
<a name="cl-101"></a>    <span class="p">}</span>
<a name="cl-102"></a>
<a name="cl-103"></a>    <span class="c1">// Internal conversion functions:</span>
<a name="cl-104"></a>    <span class="c1">//    pack&lt;Type&gt;()   - take a number (interpreted as Type), output a byte array</span>
<a name="cl-105"></a>    <span class="c1">//    unpack&lt;Type&gt;() - take a byte array, output a Type-like number</span>
<a name="cl-106"></a>
<a name="cl-107"></a>    <span class="kd">function</span> <span class="nx">as_signed</span><span class="p">(</span><span class="nx">value</span><span class="p">,</span> <span class="nx">bits</span><span class="p">)</span> <span class="p">{</span> <span class="kd">var</span> <span class="nx">s</span> <span class="o">=</span> <span class="mi">32</span> <span class="o">-</span> <span class="nx">bits</span><span class="p">;</span> <span class="k">return</span> <span class="p">(</span><span class="nx">value</span> <span class="o">&lt;&lt;</span> <span class="nx">s</span><span class="p">)</span> <span class="o">&gt;&gt;</span> <span class="nx">s</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-108"></a>    <span class="kd">function</span> <span class="nx">as_unsigned</span><span class="p">(</span><span class="nx">value</span><span class="p">,</span> <span class="nx">bits</span><span class="p">)</span> <span class="p">{</span> <span class="kd">var</span> <span class="nx">s</span> <span class="o">=</span> <span class="mi">32</span> <span class="o">-</span> <span class="nx">bits</span><span class="p">;</span> <span class="k">return</span> <span class="p">(</span><span class="nx">value</span> <span class="o">&lt;&lt;</span> <span class="nx">s</span><span class="p">)</span> <span class="o">&gt;&gt;&gt;</span> <span class="nx">s</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-109"></a>
<a name="cl-110"></a>    <span class="kd">function</span> <span class="nx">packInt8</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[</span><span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-111"></a>    <span class="kd">function</span> <span class="nx">unpackInt8</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_signed</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="mi">8</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-112"></a>
<a name="cl-113"></a>    <span class="kd">function</span> <span class="nx">packUint8</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[</span><span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-114"></a>    <span class="kd">function</span> <span class="nx">unpackUint8</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_unsigned</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">],</span> <span class="mi">8</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-115"></a>
<a name="cl-116"></a>    <span class="kd">function</span> <span class="nx">packInt16</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">8</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-117"></a>    <span class="kd">function</span> <span class="nx">unpackInt16</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_signed</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">8</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="mi">16</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-118"></a>
<a name="cl-119"></a>    <span class="kd">function</span> <span class="nx">packUint16</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">8</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-120"></a>    <span class="kd">function</span> <span class="nx">unpackUint16</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_unsigned</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">8</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">1</span><span class="p">],</span> <span class="mi">16</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-121"></a>
<a name="cl-122"></a>    <span class="kd">function</span> <span class="nx">packInt32</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">24</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="p">(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">16</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="p">(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">8</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-123"></a>    <span class="kd">function</span> <span class="nx">unpackInt32</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_signed</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">24</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">16</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">2</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">8</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">3</span><span class="p">],</span> <span class="mi">32</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-124"></a>
<a name="cl-125"></a>    <span class="kd">function</span> <span class="nx">packUint32</span><span class="p">(</span><span class="nx">n</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="p">[(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">24</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="p">(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">16</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="p">(</span><span class="nx">n</span> <span class="o">&gt;&gt;</span> <span class="mi">8</span><span class="p">)</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">,</span> <span class="nx">n</span> <span class="o">&amp;</span> <span class="mh">0xff</span><span class="p">];</span> <span class="p">}</span>
<a name="cl-126"></a>    <span class="kd">function</span> <span class="nx">unpackUint32</span><span class="p">(</span><span class="nx">bytes</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">as_unsigned</span><span class="p">(</span><span class="nx">bytes</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">24</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">1</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">16</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">2</span><span class="p">]</span> <span class="o">&lt;&lt;</span> <span class="mi">8</span> <span class="o">|</span> <span class="nx">bytes</span><span class="p">[</span><span class="mi">3</span><span class="p">],</span> <span class="mi">32</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-127"></a>
<a name="cl-128"></a>    <span class="kd">function</span> <span class="nx">packIEEE754</span><span class="p">(</span><span class="nx">v</span><span class="p">,</span> <span class="nx">ebits</span><span class="p">,</span> <span class="nx">fbits</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-129"></a>
<a name="cl-130"></a>        <span class="kd">var</span> <span class="nx">bias</span> <span class="o">=</span> <span class="p">(</span><span class="mi">1</span> <span class="o">&lt;&lt;</span> <span class="p">(</span><span class="nx">ebits</span> <span class="o">-</span> <span class="mi">1</span><span class="p">))</span> <span class="o">-</span> <span class="mi">1</span><span class="p">,</span>
<a name="cl-131"></a>            <span class="nx">s</span><span class="p">,</span> <span class="nx">e</span><span class="p">,</span> <span class="nx">f</span><span class="p">,</span> <span class="nx">ln</span><span class="p">,</span>
<a name="cl-132"></a>            <span class="nx">i</span><span class="p">,</span> <span class="nx">bits</span><span class="p">,</span> <span class="nx">str</span><span class="p">,</span> <span class="nx">bytes</span><span class="p">;</span>
<a name="cl-133"></a>
<a name="cl-134"></a>        <span class="c1">// Compute sign, exponent, fraction</span>
<a name="cl-135"></a>        <span class="k">if</span> <span class="p">(</span><span class="nb">isNaN</span><span class="p">(</span><span class="nx">v</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-136"></a>            <span class="c1">// http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping</span>
<a name="cl-137"></a>            <span class="nx">e</span> <span class="o">=</span> <span class="p">(</span><span class="mi">1</span> <span class="o">&lt;&lt;</span> <span class="nx">bias</span><span class="p">)</span> <span class="o">-</span> <span class="mi">1</span><span class="p">;</span> <span class="nx">f</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">fbits</span> <span class="o">-</span> <span class="mi">1</span><span class="p">);</span> <span class="nx">s</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-138"></a>        <span class="p">}</span>
<a name="cl-139"></a>        <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">v</span> <span class="o">===</span> <span class="kc">Infinity</span> <span class="o">||</span> <span class="nx">v</span> <span class="o">===</span> <span class="o">-</span><span class="kc">Infinity</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-140"></a>            <span class="nx">e</span> <span class="o">=</span> <span class="p">(</span><span class="mi">1</span> <span class="o">&lt;&lt;</span> <span class="nx">bias</span><span class="p">)</span> <span class="o">-</span> <span class="mi">1</span><span class="p">;</span> <span class="nx">f</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">s</span> <span class="o">=</span> <span class="p">(</span><span class="nx">v</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-141"></a>        <span class="p">}</span>
<a name="cl-142"></a>        <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">v</span> <span class="o">===</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-143"></a>            <span class="nx">e</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">f</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">s</span> <span class="o">=</span> <span class="p">(</span><span class="mi">1</span> <span class="o">/</span> <span class="nx">v</span> <span class="o">===</span> <span class="o">-</span><span class="kc">Infinity</span><span class="p">)</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-144"></a>        <span class="p">}</span>
<a name="cl-145"></a>        <span class="k">else</span> <span class="p">{</span>
<a name="cl-146"></a>            <span class="nx">s</span> <span class="o">=</span> <span class="nx">v</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-147"></a>            <span class="nx">v</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">abs</span><span class="p">(</span><span class="nx">v</span><span class="p">);</span>
<a name="cl-148"></a>
<a name="cl-149"></a>            <span class="k">if</span> <span class="p">(</span><span class="nx">v</span> <span class="o">&gt;=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="mi">1</span> <span class="o">-</span> <span class="nx">bias</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-150"></a>                <span class="c1">// Normalized</span>
<a name="cl-151"></a>                <span class="nx">ln</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">min</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nb">Math</span><span class="p">.</span><span class="nx">log</span><span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="o">/</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">LN2</span><span class="p">),</span> <span class="nx">bias</span><span class="p">);</span>
<a name="cl-152"></a>                <span class="nx">e</span> <span class="o">=</span> <span class="nx">ln</span> <span class="o">+</span> <span class="nx">bias</span><span class="p">;</span>
<a name="cl-153"></a>                <span class="nx">f</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">round</span><span class="p">(</span><span class="nx">v</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">fbits</span> <span class="o">-</span> <span class="nx">ln</span><span class="p">)</span> <span class="o">-</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">fbits</span><span class="p">));</span>
<a name="cl-154"></a>            <span class="p">}</span>
<a name="cl-155"></a>            <span class="k">else</span> <span class="p">{</span>
<a name="cl-156"></a>                <span class="c1">// Denormalized</span>
<a name="cl-157"></a>                <span class="nx">e</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-158"></a>                <span class="nx">f</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">round</span><span class="p">(</span><span class="nx">v</span> <span class="o">/</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="mi">1</span> <span class="o">-</span> <span class="nx">bias</span> <span class="o">-</span> <span class="nx">fbits</span><span class="p">));</span>
<a name="cl-159"></a>            <span class="p">}</span>
<a name="cl-160"></a>        <span class="p">}</span>
<a name="cl-161"></a>
<a name="cl-162"></a>        <span class="c1">// Pack sign, exponent, fraction</span>
<a name="cl-163"></a>        <span class="nx">bits</span> <span class="o">=</span> <span class="p">[];</span>
<a name="cl-164"></a>        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="nx">fbits</span><span class="p">;</span> <span class="nx">i</span><span class="p">;</span> <span class="nx">i</span> <span class="o">-=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="nx">bits</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">f</span> <span class="o">%</span> <span class="mi">2</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">);</span> <span class="nx">f</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">f</span> <span class="o">/</span> <span class="mi">2</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-165"></a>        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="nx">ebits</span><span class="p">;</span> <span class="nx">i</span><span class="p">;</span> <span class="nx">i</span> <span class="o">-=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="nx">bits</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">e</span> <span class="o">%</span> <span class="mi">2</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">);</span> <span class="nx">e</span> <span class="o">=</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">floor</span><span class="p">(</span><span class="nx">e</span> <span class="o">/</span> <span class="mi">2</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-166"></a>        <span class="nx">bits</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">s</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">);</span>
<a name="cl-167"></a>        <span class="nx">bits</span><span class="p">.</span><span class="nx">reverse</span><span class="p">();</span>
<a name="cl-168"></a>        <span class="nx">str</span> <span class="o">=</span> <span class="nx">bits</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span>
<a name="cl-169"></a>
<a name="cl-170"></a>        <span class="c1">// Bits to bytes</span>
<a name="cl-171"></a>        <span class="nx">bytes</span> <span class="o">=</span> <span class="p">[];</span>
<a name="cl-172"></a>        <span class="k">while</span> <span class="p">(</span><span class="nx">str</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-173"></a>            <span class="nx">bytes</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nb">parseInt</span><span class="p">(</span><span class="nx">str</span><span class="p">.</span><span class="nx">substring</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">8</span><span class="p">),</span> <span class="mi">2</span><span class="p">));</span>
<a name="cl-174"></a>            <span class="nx">str</span> <span class="o">=</span> <span class="nx">str</span><span class="p">.</span><span class="nx">substring</span><span class="p">(</span><span class="mi">8</span><span class="p">);</span>
<a name="cl-175"></a>        <span class="p">}</span>
<a name="cl-176"></a>        <span class="k">return</span> <span class="nx">bytes</span><span class="p">;</span>
<a name="cl-177"></a>    <span class="p">}</span>
<a name="cl-178"></a>
<a name="cl-179"></a>    <span class="kd">function</span> <span class="nx">unpackIEEE754</span><span class="p">(</span><span class="nx">bytes</span><span class="p">,</span> <span class="nx">ebits</span><span class="p">,</span> <span class="nx">fbits</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-180"></a>
<a name="cl-181"></a>        <span class="c1">// Bytes to bits</span>
<a name="cl-182"></a>        <span class="kd">var</span> <span class="nx">bits</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">j</span><span class="p">,</span> <span class="nx">b</span><span class="p">,</span> <span class="nx">str</span><span class="p">,</span>
<a name="cl-183"></a>            <span class="nx">bias</span><span class="p">,</span> <span class="nx">s</span><span class="p">,</span> <span class="nx">e</span><span class="p">,</span> <span class="nx">f</span><span class="p">;</span>
<a name="cl-184"></a>
<a name="cl-185"></a>        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="nx">bytes</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span><span class="p">;</span> <span class="nx">i</span> <span class="o">-=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-186"></a>            <span class="nx">b</span> <span class="o">=</span> <span class="nx">bytes</span><span class="p">[</span><span class="nx">i</span> <span class="o">-</span> <span class="mi">1</span><span class="p">];</span>
<a name="cl-187"></a>            <span class="k">for</span> <span class="p">(</span><span class="nx">j</span> <span class="o">=</span> <span class="mi">8</span><span class="p">;</span> <span class="nx">j</span><span class="p">;</span> <span class="nx">j</span> <span class="o">-=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-188"></a>                <span class="nx">bits</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">b</span> <span class="o">%</span> <span class="mi">2</span> <span class="o">?</span> <span class="mi">1</span> <span class="o">:</span> <span class="mi">0</span><span class="p">);</span> <span class="nx">b</span> <span class="o">=</span> <span class="nx">b</span> <span class="o">&gt;&gt;</span> <span class="mi">1</span><span class="p">;</span>
<a name="cl-189"></a>            <span class="p">}</span>
<a name="cl-190"></a>        <span class="p">}</span>
<a name="cl-191"></a>        <span class="nx">bits</span><span class="p">.</span><span class="nx">reverse</span><span class="p">();</span>
<a name="cl-192"></a>        <span class="nx">str</span> <span class="o">=</span> <span class="nx">bits</span><span class="p">.</span><span class="nx">join</span><span class="p">(</span><span class="s1">&#39;&#39;</span><span class="p">);</span>
<a name="cl-193"></a>
<a name="cl-194"></a>        <span class="c1">// Unpack sign, exponent, fraction</span>
<a name="cl-195"></a>        <span class="nx">bias</span> <span class="o">=</span> <span class="p">(</span><span class="mi">1</span> <span class="o">&lt;&lt;</span> <span class="p">(</span><span class="nx">ebits</span> <span class="o">-</span> <span class="mi">1</span><span class="p">))</span> <span class="o">-</span> <span class="mi">1</span><span class="p">;</span>
<a name="cl-196"></a>        <span class="nx">s</span> <span class="o">=</span> <span class="nb">parseInt</span><span class="p">(</span><span class="nx">str</span><span class="p">.</span><span class="nx">substring</span><span class="p">(</span><span class="mi">0</span><span class="p">,</span> <span class="mi">1</span><span class="p">),</span> <span class="mi">2</span><span class="p">)</span> <span class="o">?</span> <span class="o">-</span><span class="mi">1</span> <span class="o">:</span> <span class="mi">1</span><span class="p">;</span>
<a name="cl-197"></a>        <span class="nx">e</span> <span class="o">=</span> <span class="nb">parseInt</span><span class="p">(</span><span class="nx">str</span><span class="p">.</span><span class="nx">substring</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="mi">1</span> <span class="o">+</span> <span class="nx">ebits</span><span class="p">),</span> <span class="mi">2</span><span class="p">);</span>
<a name="cl-198"></a>        <span class="nx">f</span> <span class="o">=</span> <span class="nb">parseInt</span><span class="p">(</span><span class="nx">str</span><span class="p">.</span><span class="nx">substring</span><span class="p">(</span><span class="mi">1</span> <span class="o">+</span> <span class="nx">ebits</span><span class="p">),</span> <span class="mi">2</span><span class="p">);</span>
<a name="cl-199"></a>
<a name="cl-200"></a>        <span class="c1">// Produce number</span>
<a name="cl-201"></a>        <span class="k">if</span> <span class="p">(</span><span class="nx">e</span> <span class="o">===</span> <span class="p">(</span><span class="mi">1</span> <span class="o">&lt;&lt;</span> <span class="nx">ebits</span><span class="p">)</span> <span class="o">-</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-202"></a>            <span class="k">return</span> <span class="nx">f</span> <span class="o">!==</span> <span class="mi">0</span> <span class="o">?</span> <span class="kc">NaN</span> <span class="o">:</span> <span class="nx">s</span> <span class="o">*</span> <span class="kc">Infinity</span><span class="p">;</span>
<a name="cl-203"></a>        <span class="p">}</span>
<a name="cl-204"></a>        <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">e</span> <span class="o">&gt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-205"></a>            <span class="c1">// Normalized</span>
<a name="cl-206"></a>            <span class="k">return</span> <span class="nx">s</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">e</span> <span class="o">-</span> <span class="nx">bias</span><span class="p">)</span> <span class="o">*</span> <span class="p">(</span><span class="mi">1</span> <span class="o">+</span> <span class="nx">f</span> <span class="o">/</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">fbits</span><span class="p">));</span>
<a name="cl-207"></a>        <span class="p">}</span>
<a name="cl-208"></a>        <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="nx">f</span> <span class="o">!==</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-209"></a>            <span class="c1">// Denormalized</span>
<a name="cl-210"></a>            <span class="k">return</span> <span class="nx">s</span> <span class="o">*</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="o">-</span><span class="p">(</span><span class="nx">bias</span> <span class="o">-</span> <span class="mi">1</span><span class="p">))</span> <span class="o">*</span> <span class="p">(</span><span class="nx">f</span> <span class="o">/</span> <span class="nb">Math</span><span class="p">.</span><span class="nx">pow</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">fbits</span><span class="p">));</span>
<a name="cl-211"></a>        <span class="p">}</span>
<a name="cl-212"></a>        <span class="k">else</span> <span class="p">{</span>
<a name="cl-213"></a>            <span class="k">return</span> <span class="nx">s</span> <span class="o">&lt;</span> <span class="mi">0</span> <span class="o">?</span> <span class="o">-</span><span class="mi">0</span> <span class="o">:</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-214"></a>        <span class="p">}</span>
<a name="cl-215"></a>    <span class="p">}</span>
<a name="cl-216"></a>
<a name="cl-217"></a>    <span class="kd">function</span> <span class="nx">unpackFloat64</span><span class="p">(</span><span class="nx">b</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">unpackIEEE754</span><span class="p">(</span><span class="nx">b</span><span class="p">,</span> <span class="mi">11</span><span class="p">,</span> <span class="mi">52</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-218"></a>    <span class="kd">function</span> <span class="nx">packFloat64</span><span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">packIEEE754</span><span class="p">(</span><span class="nx">v</span><span class="p">,</span> <span class="mi">11</span><span class="p">,</span> <span class="mi">52</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-219"></a>    <span class="kd">function</span> <span class="nx">unpackFloat32</span><span class="p">(</span><span class="nx">b</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">unpackIEEE754</span><span class="p">(</span><span class="nx">b</span><span class="p">,</span> <span class="mi">8</span><span class="p">,</span> <span class="mi">23</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-220"></a>    <span class="kd">function</span> <span class="nx">packFloat32</span><span class="p">(</span><span class="nx">v</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">packIEEE754</span><span class="p">(</span><span class="nx">v</span><span class="p">,</span> <span class="mi">8</span><span class="p">,</span> <span class="mi">23</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-221"></a>
<a name="cl-222"></a>
<a name="cl-223"></a>    <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">ArrayBuffer</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-224"></a>        <span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
<a name="cl-225"></a>
<a name="cl-226"></a>            <span class="c1">//</span>
<a name="cl-227"></a>            <span class="c1">// 3 The ArrayBuffer Type</span>
<a name="cl-228"></a>            <span class="c1">//</span>
<a name="cl-229"></a>
<a name="cl-230"></a>            <span class="nx">ArrayBuffer</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-231"></a>                <span class="nx">length</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToInt32</span><span class="p">(</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-232"></a>                <span class="k">if</span> <span class="p">(</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">RangeError</span><span class="p">(</span><span class="s1">&#39;ArrayBuffer size is not a small enough positive integer.&#39;</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-233"></a>
<a name="cl-234"></a>                <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="nx">length</span><span class="p">;</span>
<a name="cl-235"></a>                <span class="k">this</span><span class="p">.</span><span class="nx">_bytes</span> <span class="o">=</span> <span class="p">[];</span>
<a name="cl-236"></a>                <span class="k">this</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">length</span><span class="p">;</span>
<a name="cl-237"></a>
<a name="cl-238"></a>                <span class="kd">var</span> <span class="nx">i</span><span class="p">;</span>
<a name="cl-239"></a>                <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-240"></a>                    <span class="k">this</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">i</span><span class="p">]</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-241"></a>                <span class="p">}</span>
<a name="cl-242"></a>
<a name="cl-243"></a>                <span class="nx">configureProperties</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
<a name="cl-244"></a>            <span class="p">};</span>
<a name="cl-245"></a>
<a name="cl-246"></a>
<a name="cl-247"></a>            <span class="c1">//</span>
<a name="cl-248"></a>            <span class="c1">// 4 The ArrayBufferView Type</span>
<a name="cl-249"></a>            <span class="c1">//</span>
<a name="cl-250"></a>
<a name="cl-251"></a>            <span class="c1">// NOTE: this constructor is not exported</span>
<a name="cl-252"></a>            <span class="nx">ArrayBufferView</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
<a name="cl-253"></a>                <span class="c1">//this.buffer = null;</span>
<a name="cl-254"></a>                <span class="c1">//this.byteOffset = 0;</span>
<a name="cl-255"></a>                <span class="c1">//this.byteLength = 0;</span>
<a name="cl-256"></a>            <span class="p">};</span>
<a name="cl-257"></a>
<a name="cl-258"></a>            <span class="c1">//</span>
<a name="cl-259"></a>            <span class="c1">// 5 The Typed Array View Types</span>
<a name="cl-260"></a>            <span class="c1">//</span>
<a name="cl-261"></a>
<a name="cl-262"></a>            <span class="kd">function</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="nx">bytesPerElement</span><span class="p">,</span> <span class="nx">pack</span><span class="p">,</span> <span class="nx">unpack</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-263"></a>                <span class="c1">// Each TypedArray type requires a distinct constructor instance with</span>
<a name="cl-264"></a>                <span class="c1">// identical logic, which this produces.</span>
<a name="cl-265"></a>
<a name="cl-266"></a>                <span class="kd">var</span> <span class="nx">ctor</span><span class="p">;</span>
<a name="cl-267"></a>                <span class="nx">ctor</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">buffer</span><span class="p">,</span> <span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-268"></a>                    <span class="kd">var</span> <span class="nx">array</span><span class="p">,</span> <span class="nx">sequence</span><span class="p">,</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">s</span><span class="p">;</span>
<a name="cl-269"></a>
<a name="cl-270"></a>                    <span class="c1">// Constructor(unsigned long length)</span>
<a name="cl-271"></a>                    <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">||</span> <span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;number&#39;</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-272"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToInt32</span><span class="p">(</span><span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]);</span>
<a name="cl-273"></a>                        <span class="k">if</span> <span class="p">(</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">RangeError</span><span class="p">(</span><span class="s1">&#39;ArrayBufferView size is not a small enough positive integer.&#39;</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-274"></a>
<a name="cl-275"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-276"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ArrayBuffer</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">);</span>
<a name="cl-277"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-278"></a>                    <span class="p">}</span>
<a name="cl-279"></a>
<a name="cl-280"></a>                    <span class="c1">// Constructor(TypedArray array)</span>
<a name="cl-281"></a>                    <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">constructor</span> <span class="o">===</span> <span class="nx">ctor</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-282"></a>                        <span class="nx">array</span> <span class="o">=</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span>
<a name="cl-283"></a>
<a name="cl-284"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span>
<a name="cl-285"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-286"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ArrayBuffer</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">);</span>
<a name="cl-287"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-288"></a>
<a name="cl-289"></a>                        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-290"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">_setter</span><span class="p">(</span><span class="nx">i</span><span class="p">,</span> <span class="nx">array</span><span class="p">.</span><span class="nx">_getter</span><span class="p">(</span><span class="nx">i</span><span class="p">));</span>
<a name="cl-291"></a>                        <span class="p">}</span>
<a name="cl-292"></a>                    <span class="p">}</span>
<a name="cl-293"></a>
<a name="cl-294"></a>                    <span class="c1">// Constructor(sequence&lt;type&gt; array)</span>
<a name="cl-295"></a>                    <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="o">!</span><span class="p">(</span><span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="k">instanceof</span> <span class="nx">ArrayBuffer</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-296"></a>                        <span class="nx">sequence</span> <span class="o">=</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span>
<a name="cl-297"></a>
<a name="cl-298"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">sequence</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-299"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-300"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ArrayBuffer</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">);</span>
<a name="cl-301"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-302"></a>
<a name="cl-303"></a>                        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-304"></a>                            <span class="nx">s</span> <span class="o">=</span> <span class="nx">sequence</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span>
<a name="cl-305"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">_setter</span><span class="p">(</span><span class="nx">i</span><span class="p">,</span> <span class="nb">Number</span><span class="p">(</span><span class="nx">s</span><span class="p">));</span>
<a name="cl-306"></a>                        <span class="p">}</span>
<a name="cl-307"></a>                    <span class="p">}</span>
<a name="cl-308"></a>
<a name="cl-309"></a>                    <span class="c1">// Constructor(ArrayBuffer buffer,</span>
<a name="cl-310"></a>                    <span class="c1">//             optional unsigned long byteOffset, optional unsigned long length)</span>
<a name="cl-311"></a>                    <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="k">instanceof</span> <span class="nx">ArrayBuffer</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-312"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">=</span> <span class="nx">buffer</span><span class="p">;</span>
<a name="cl-313"></a>
<a name="cl-314"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">byteOffset</span><span class="p">);</span>
<a name="cl-315"></a>                        <span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-316"></a>                            <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// byteOffset out of range</span>
<a name="cl-317"></a>                        <span class="p">}</span>
<a name="cl-318"></a>
<a name="cl-319"></a>                        <span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">%</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-320"></a>                            <span class="c1">// The given byteOffset must be a multiple of the element</span>
<a name="cl-321"></a>                            <span class="c1">// size of the specific type, otherwise an exception is raised.</span>
<a name="cl-322"></a>                            <span class="c1">//raise_INDEX_SIZE_ERR();</span>
<a name="cl-323"></a>                            <span class="k">throw</span> <span class="k">new</span> <span class="nx">RangeError</span><span class="p">(</span><span class="s2">&quot;ArrayBuffer length minus the byteOffset is not a multiple of the element size.&quot;</span><span class="p">);</span>
<a name="cl-324"></a>                        <span class="p">}</span>
<a name="cl-325"></a>
<a name="cl-326"></a>                        <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">3</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-327"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">-</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span><span class="p">;</span>
<a name="cl-328"></a>
<a name="cl-329"></a>                            <span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">%</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-330"></a>                                <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// length of buffer minus byteOffset not a multiple of the element size</span>
<a name="cl-331"></a>                            <span class="p">}</span>
<a name="cl-332"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">/</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-333"></a>                        <span class="p">}</span>
<a name="cl-334"></a>                        <span class="k">else</span> <span class="p">{</span>
<a name="cl-335"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-336"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-337"></a>                        <span class="p">}</span>
<a name="cl-338"></a>
<a name="cl-339"></a>                        <span class="k">if</span> <span class="p">((</span><span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-340"></a>                            <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// byteOffset and length reference an area beyond the end of the buffer</span>
<a name="cl-341"></a>                        <span class="p">}</span>
<a name="cl-342"></a>                    <span class="p">}</span>
<a name="cl-343"></a>                    <span class="k">else</span> <span class="p">{</span>
<a name="cl-344"></a>                        <span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s2">&quot;Unexpected argument type(s)&quot;</span><span class="p">);</span>
<a name="cl-345"></a>                    <span class="p">}</span>
<a name="cl-346"></a>
<a name="cl-347"></a>                    <span class="k">this</span><span class="p">.</span><span class="nx">constructor</span> <span class="o">=</span> <span class="nx">ctor</span><span class="p">;</span>
<a name="cl-348"></a>
<a name="cl-349"></a>                    <span class="c1">// ES5-only magic</span>
<a name="cl-350"></a>                    <span class="nx">configureProperties</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
<a name="cl-351"></a>                    <span class="nx">makeArrayAccessors</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
<a name="cl-352"></a>                <span class="p">};</span>
<a name="cl-353"></a>
<a name="cl-354"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ArrayBufferView</span><span class="p">();</span>
<a name="cl-355"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span> <span class="o">=</span> <span class="nx">bytesPerElement</span><span class="p">;</span>
<a name="cl-356"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">_pack</span> <span class="o">=</span> <span class="nx">pack</span><span class="p">;</span>
<a name="cl-357"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">_unpack</span> <span class="o">=</span> <span class="nx">unpack</span><span class="p">;</span>
<a name="cl-358"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span> <span class="o">=</span> <span class="nx">bytesPerElement</span><span class="p">;</span>
<a name="cl-359"></a>
<a name="cl-360"></a>                <span class="c1">// getter type (unsigned long index);</span>
<a name="cl-361"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">_getter</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">index</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-362"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">SyntaxError</span><span class="p">(</span><span class="s2">&quot;Not enough arguments&quot;</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-363"></a>
<a name="cl-364"></a>                    <span class="nx">index</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">index</span><span class="p">);</span>
<a name="cl-365"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">index</span> <span class="o">&gt;=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-366"></a>                        <span class="c1">//raise_INDEX_SIZE_ERR(); // Array index out of range</span>
<a name="cl-367"></a>                        <span class="k">return</span><span class="p">;</span> <span class="c1">// undefined</span>
<a name="cl-368"></a>                    <span class="p">}</span>
<a name="cl-369"></a>
<a name="cl-370"></a>                    <span class="kd">var</span> <span class="nx">bytes</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">o</span><span class="p">;</span>
<a name="cl-371"></a>                    <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">o</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="nx">index</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-372"></a>                        <span class="nx">i</span> <span class="o">&lt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-373"></a>                        <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">o</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-374"></a>                        <span class="nx">bytes</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">o</span><span class="p">]);</span>
<a name="cl-375"></a>                    <span class="p">}</span>
<a name="cl-376"></a>                    <span class="k">return</span> <span class="k">this</span><span class="p">.</span><span class="nx">_unpack</span><span class="p">(</span><span class="nx">bytes</span><span class="p">);</span>
<a name="cl-377"></a>                <span class="p">};</span>
<a name="cl-378"></a>
<a name="cl-379"></a>                <span class="c1">// NONSTANDARD: convenience alias for getter: type get(unsigned long index);</span>
<a name="cl-380"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">get</span> <span class="o">=</span> <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">_getter</span><span class="p">;</span>
<a name="cl-381"></a>
<a name="cl-382"></a>                <span class="c1">// setter void (unsigned long index, type value);</span>
<a name="cl-383"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">_setter</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">index</span><span class="p">,</span> <span class="nx">value</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-384"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">2</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">SyntaxError</span><span class="p">(</span><span class="s2">&quot;Not enough arguments&quot;</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-385"></a>
<a name="cl-386"></a>                    <span class="nx">index</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">index</span><span class="p">);</span>
<a name="cl-387"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">index</span> <span class="o">&gt;=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-388"></a>                        <span class="c1">//raise_INDEX_SIZE_ERR(); // Array index out of range</span>
<a name="cl-389"></a>                        <span class="k">return</span><span class="p">;</span>
<a name="cl-390"></a>                    <span class="p">}</span>
<a name="cl-391"></a>
<a name="cl-392"></a>                    <span class="kd">var</span> <span class="nx">bytes</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">_pack</span><span class="p">(</span><span class="nx">value</span><span class="p">),</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">o</span><span class="p">;</span>
<a name="cl-393"></a>                    <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">o</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="nx">index</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-394"></a>                        <span class="nx">i</span> <span class="o">&lt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-395"></a>                        <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">o</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-396"></a>                        <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">o</span><span class="p">]</span> <span class="o">=</span> <span class="nx">bytes</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span>
<a name="cl-397"></a>                    <span class="p">}</span>
<a name="cl-398"></a>                <span class="p">};</span>
<a name="cl-399"></a>
<a name="cl-400"></a>                <span class="c1">// void set(TypedArray array, optional unsigned long offset);</span>
<a name="cl-401"></a>                <span class="c1">// void set(sequence&lt;type&gt; array, optional unsigned long offset);</span>
<a name="cl-402"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">set</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">index</span><span class="p">,</span> <span class="nx">value</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-403"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="k">throw</span> <span class="k">new</span> <span class="nx">SyntaxError</span><span class="p">(</span><span class="s2">&quot;Not enough arguments&quot;</span><span class="p">);</span> <span class="p">}</span>
<a name="cl-404"></a>                    <span class="kd">var</span> <span class="nx">array</span><span class="p">,</span> <span class="nx">sequence</span><span class="p">,</span> <span class="nx">offset</span><span class="p">,</span> <span class="nx">len</span><span class="p">,</span>
<a name="cl-405"></a>                        <span class="nx">i</span><span class="p">,</span> <span class="nx">s</span><span class="p">,</span> <span class="nx">d</span><span class="p">,</span>
<a name="cl-406"></a>                        <span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">byteLength</span><span class="p">,</span> <span class="nx">tmp</span><span class="p">;</span>
<a name="cl-407"></a>
<a name="cl-408"></a>                    <span class="c1">// void set(TypedArray array, optional unsigned long offset);</span>
<a name="cl-409"></a>                    <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">constructor</span> <span class="o">===</span> <span class="k">this</span><span class="p">.</span><span class="nx">constructor</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-410"></a>                        <span class="nx">array</span> <span class="o">=</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span>
<a name="cl-411"></a>                        <span class="nx">offset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">arguments</span><span class="p">[</span><span class="mi">1</span><span class="p">]);</span>
<a name="cl-412"></a>
<a name="cl-413"></a>                        <span class="k">if</span> <span class="p">(</span><span class="nx">offset</span> <span class="o">+</span> <span class="nx">array</span><span class="p">.</span><span class="nx">length</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-414"></a>                            <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// Offset plus length of array is out of range</span>
<a name="cl-415"></a>                        <span class="p">}</span>
<a name="cl-416"></a>
<a name="cl-417"></a>                        <span class="nx">byteOffset</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="nx">offset</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-418"></a>                        <span class="nx">byteLength</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">length</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span>
<a name="cl-419"></a>
<a name="cl-420"></a>                        <span class="k">if</span> <span class="p">(</span><span class="nx">array</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">===</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-421"></a>                            <span class="nx">tmp</span> <span class="o">=</span> <span class="p">[];</span>
<a name="cl-422"></a>                            <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">s</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">byteOffset</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">byteLength</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">s</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-423"></a>                                <span class="nx">tmp</span><span class="p">[</span><span class="nx">i</span><span class="p">]</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">s</span><span class="p">];</span>
<a name="cl-424"></a>                            <span class="p">}</span>
<a name="cl-425"></a>                            <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">d</span> <span class="o">=</span> <span class="nx">byteOffset</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">byteLength</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">d</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-426"></a>                                <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">d</span><span class="p">]</span> <span class="o">=</span> <span class="nx">tmp</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span>
<a name="cl-427"></a>                            <span class="p">}</span>
<a name="cl-428"></a>                        <span class="p">}</span>
<a name="cl-429"></a>                        <span class="k">else</span> <span class="p">{</span>
<a name="cl-430"></a>                            <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">,</span> <span class="nx">s</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">d</span> <span class="o">=</span> <span class="nx">byteOffset</span><span class="p">;</span>
<a name="cl-431"></a>                                <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">byteLength</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">s</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">,</span> <span class="nx">d</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-432"></a>                                <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">d</span><span class="p">]</span> <span class="o">=</span> <span class="nx">array</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">_bytes</span><span class="p">[</span><span class="nx">s</span><span class="p">];</span>
<a name="cl-433"></a>                            <span class="p">}</span>
<a name="cl-434"></a>                        <span class="p">}</span>
<a name="cl-435"></a>                    <span class="p">}</span>
<a name="cl-436"></a>
<a name="cl-437"></a>                    <span class="c1">// void set(sequence&lt;type&gt; array, optional unsigned long offset);</span>
<a name="cl-438"></a>                    <span class="k">else</span> <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="k">typeof</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">].</span><span class="nx">length</span> <span class="o">!==</span> <span class="s1">&#39;undefined&#39;</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-439"></a>                        <span class="nx">sequence</span> <span class="o">=</span> <span class="nx">arguments</span><span class="p">[</span><span class="mi">0</span><span class="p">];</span>
<a name="cl-440"></a>                        <span class="nx">len</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">sequence</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-441"></a>                        <span class="nx">offset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">arguments</span><span class="p">[</span><span class="mi">1</span><span class="p">]);</span>
<a name="cl-442"></a>
<a name="cl-443"></a>                        <span class="k">if</span> <span class="p">(</span><span class="nx">offset</span> <span class="o">+</span> <span class="nx">len</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-444"></a>                            <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// Offset plus length of array is out of range</span>
<a name="cl-445"></a>                        <span class="p">}</span>
<a name="cl-446"></a>
<a name="cl-447"></a>                        <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">len</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-448"></a>                            <span class="nx">s</span> <span class="o">=</span> <span class="nx">sequence</span><span class="p">[</span><span class="nx">i</span><span class="p">];</span>
<a name="cl-449"></a>                            <span class="k">this</span><span class="p">.</span><span class="nx">_setter</span><span class="p">(</span><span class="nx">offset</span> <span class="o">+</span> <span class="nx">i</span><span class="p">,</span> <span class="nb">Number</span><span class="p">(</span><span class="nx">s</span><span class="p">));</span>
<a name="cl-450"></a>                        <span class="p">}</span>
<a name="cl-451"></a>                    <span class="p">}</span>
<a name="cl-452"></a>
<a name="cl-453"></a>                    <span class="k">else</span> <span class="p">{</span>
<a name="cl-454"></a>                        <span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s2">&quot;Unexpected argument type(s)&quot;</span><span class="p">);</span>
<a name="cl-455"></a>                    <span class="p">}</span>
<a name="cl-456"></a>                <span class="p">};</span>
<a name="cl-457"></a>
<a name="cl-458"></a>                <span class="c1">// TypedArray subarray(long begin, optional long end);</span>
<a name="cl-459"></a>                <span class="nx">ctor</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">subarray</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">start</span><span class="p">,</span> <span class="nx">end</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-460"></a>                    <span class="kd">function</span> <span class="nx">clamp</span><span class="p">(</span><span class="nx">v</span><span class="p">,</span> <span class="nx">min</span><span class="p">,</span> <span class="nx">max</span><span class="p">)</span> <span class="p">{</span> <span class="k">return</span> <span class="nx">v</span> <span class="o">&lt;</span> <span class="nx">min</span> <span class="o">?</span> <span class="nx">min</span> <span class="o">:</span> <span class="nx">v</span> <span class="o">&gt;</span> <span class="nx">max</span> <span class="o">?</span> <span class="nx">max</span> <span class="o">:</span> <span class="nx">v</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-461"></a>
<a name="cl-462"></a>                    <span class="nx">start</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToInt32</span><span class="p">(</span><span class="nx">start</span><span class="p">);</span>
<a name="cl-463"></a>                    <span class="nx">end</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToInt32</span><span class="p">(</span><span class="nx">end</span><span class="p">);</span>
<a name="cl-464"></a>
<a name="cl-465"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span> <span class="nx">start</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-466"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">2</span><span class="p">)</span> <span class="p">{</span> <span class="nx">end</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-467"></a>
<a name="cl-468"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">start</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="nx">start</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">+</span> <span class="nx">start</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-469"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">end</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span> <span class="nx">end</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span> <span class="o">+</span> <span class="nx">end</span><span class="p">;</span> <span class="p">}</span>
<a name="cl-470"></a>
<a name="cl-471"></a>                    <span class="nx">start</span> <span class="o">=</span> <span class="nx">clamp</span><span class="p">(</span><span class="nx">start</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-472"></a>                    <span class="nx">end</span> <span class="o">=</span> <span class="nx">clamp</span><span class="p">(</span><span class="nx">end</span><span class="p">,</span> <span class="mi">0</span><span class="p">,</span> <span class="k">this</span><span class="p">.</span><span class="nx">length</span><span class="p">);</span>
<a name="cl-473"></a>
<a name="cl-474"></a>                    <span class="kd">var</span> <span class="nx">len</span> <span class="o">=</span> <span class="nx">end</span> <span class="o">-</span> <span class="nx">start</span><span class="p">;</span>
<a name="cl-475"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">len</span> <span class="o">&lt;</span> <span class="mi">0</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-476"></a>                        <span class="nx">len</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span>
<a name="cl-477"></a>                    <span class="p">}</span>
<a name="cl-478"></a>
<a name="cl-479"></a>                    <span class="k">return</span> <span class="k">new</span> <span class="k">this</span><span class="p">.</span><span class="nx">constructor</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">,</span> <span class="nx">start</span> <span class="o">*</span> <span class="k">this</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">,</span> <span class="nx">len</span><span class="p">);</span>
<a name="cl-480"></a>                <span class="p">};</span>
<a name="cl-481"></a>
<a name="cl-482"></a>                <span class="k">return</span> <span class="nx">ctor</span><span class="p">;</span>
<a name="cl-483"></a>            <span class="p">}</span>
<a name="cl-484"></a>
<a name="cl-485"></a>            <span class="nx">Int8Array</span> <span class="o">=</span> <span class="nx">Int8Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="nx">packInt8</span><span class="p">,</span> <span class="nx">unpackInt8</span><span class="p">);</span>
<a name="cl-486"></a>            <span class="nx">Uint8Array</span> <span class="o">=</span> <span class="nx">Uint8Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">1</span><span class="p">,</span> <span class="nx">packUint8</span><span class="p">,</span> <span class="nx">unpackUint8</span><span class="p">);</span>
<a name="cl-487"></a>            <span class="nx">Int16Array</span> <span class="o">=</span> <span class="nx">Int16Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">packInt16</span><span class="p">,</span> <span class="nx">unpackInt16</span><span class="p">);</span>
<a name="cl-488"></a>            <span class="nx">Uint16Array</span> <span class="o">=</span> <span class="nx">Uint16Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">2</span><span class="p">,</span> <span class="nx">packUint16</span><span class="p">,</span> <span class="nx">unpackUint16</span><span class="p">);</span>
<a name="cl-489"></a>            <span class="nx">Int32Array</span> <span class="o">=</span> <span class="nx">Int32Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">4</span><span class="p">,</span> <span class="nx">packInt32</span><span class="p">,</span> <span class="nx">unpackInt32</span><span class="p">);</span>
<a name="cl-490"></a>            <span class="nx">Uint32Array</span> <span class="o">=</span> <span class="nx">Uint32Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">4</span><span class="p">,</span> <span class="nx">packUint32</span><span class="p">,</span> <span class="nx">unpackUint32</span><span class="p">);</span>
<a name="cl-491"></a>            <span class="nx">Float32Array</span> <span class="o">=</span> <span class="nx">Float32Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">4</span><span class="p">,</span> <span class="nx">packFloat32</span><span class="p">,</span> <span class="nx">unpackFloat32</span><span class="p">);</span>
<a name="cl-492"></a>            <span class="nx">Float64Array</span> <span class="o">=</span> <span class="nx">Float64Array</span> <span class="o">||</span> <span class="nx">makeTypedArrayConstructor</span><span class="p">(</span><span class="mi">8</span><span class="p">,</span> <span class="nx">packFloat64</span><span class="p">,</span> <span class="nx">unpackFloat64</span><span class="p">);</span>
<a name="cl-493"></a>
<a name="cl-494"></a>        <span class="p">}</span> <span class="p">());</span>
<a name="cl-495"></a>    <span class="p">}</span>
<a name="cl-496"></a>
<a name="cl-497"></a>
<a name="cl-498"></a>    <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="nx">DataView</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-499"></a>        <span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
<a name="cl-500"></a>
<a name="cl-501"></a>            <span class="c1">//</span>
<a name="cl-502"></a>            <span class="c1">// 6 The DataView View Type</span>
<a name="cl-503"></a>            <span class="c1">//</span>
<a name="cl-504"></a>
<a name="cl-505"></a>            <span class="kd">function</span> <span class="nx">r</span><span class="p">(</span><span class="nx">array</span><span class="p">,</span> <span class="nx">index</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-506"></a>                <span class="k">if</span> <span class="p">(</span><span class="k">typeof</span> <span class="nx">array</span><span class="p">.</span><span class="nx">get</span> <span class="o">===</span> <span class="s1">&#39;function&#39;</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-507"></a>                    <span class="k">return</span> <span class="nx">array</span><span class="p">.</span><span class="nx">get</span><span class="p">(</span><span class="nx">index</span><span class="p">);</span>
<a name="cl-508"></a>                <span class="p">}</span>
<a name="cl-509"></a>                <span class="k">else</span> <span class="p">{</span>
<a name="cl-510"></a>                    <span class="k">return</span> <span class="nx">array</span><span class="p">[</span><span class="nx">index</span><span class="p">];</span>
<a name="cl-511"></a>                <span class="p">}</span>
<a name="cl-512"></a>            <span class="p">}</span>
<a name="cl-513"></a>
<a name="cl-514"></a>
<a name="cl-515"></a>            <span class="kd">var</span> <span class="nx">IS_BIG_ENDIAN</span> <span class="o">=</span> <span class="p">(</span><span class="kd">function</span> <span class="p">()</span> <span class="p">{</span>
<a name="cl-516"></a>                <span class="kd">var</span> <span class="nx">u16array</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Uint16Array</span><span class="p">([</span><span class="mh">0x1234</span><span class="p">]),</span>
<a name="cl-517"></a>                <span class="nx">u8array</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Uint8Array</span><span class="p">(</span><span class="nx">u16array</span><span class="p">.</span><span class="nx">buffer</span><span class="p">);</span>
<a name="cl-518"></a>                <span class="k">return</span> <span class="nx">r</span><span class="p">(</span><span class="nx">u8array</span><span class="p">,</span> <span class="mi">0</span><span class="p">)</span> <span class="o">===</span> <span class="mh">0x12</span><span class="p">;</span>
<a name="cl-519"></a>            <span class="p">}</span> <span class="p">());</span>
<a name="cl-520"></a>
<a name="cl-521"></a>            <span class="c1">// Constructor(ArrayBuffer buffer,</span>
<a name="cl-522"></a>            <span class="c1">//             optional unsigned long byteOffset,</span>
<a name="cl-523"></a>            <span class="c1">//             optional unsigned long byteLength)</span>
<a name="cl-524"></a>            <span class="nx">DataView</span> <span class="o">=</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">buffer</span><span class="p">,</span> <span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-525"></a>                <span class="k">if</span> <span class="p">(</span><span class="o">!</span><span class="p">(</span><span class="k">typeof</span> <span class="nx">buffer</span> <span class="o">===</span> <span class="s1">&#39;object&#39;</span> <span class="o">&amp;&amp;</span> <span class="nx">buffer</span> <span class="k">instanceof</span> <span class="nx">ArrayBuffer</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-526"></a>                    <span class="k">throw</span> <span class="k">new</span> <span class="nx">TypeError</span><span class="p">(</span><span class="s2">&quot;TypeError&quot;</span><span class="p">);</span>
<a name="cl-527"></a>                <span class="p">}</span>
<a name="cl-528"></a>
<a name="cl-529"></a>                <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span> <span class="o">=</span> <span class="nx">buffer</span><span class="p">;</span>
<a name="cl-530"></a>
<a name="cl-531"></a>                <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">byteOffset</span><span class="p">);</span>
<a name="cl-532"></a>                <span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-533"></a>                    <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// byteOffset out of range</span>
<a name="cl-534"></a>                <span class="p">}</span>
<a name="cl-535"></a>
<a name="cl-536"></a>                <span class="k">if</span> <span class="p">(</span><span class="nx">arguments</span><span class="p">.</span><span class="nx">length</span> <span class="o">&lt;</span> <span class="mi">3</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-537"></a>                    <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">-</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span><span class="p">;</span>
<a name="cl-538"></a>                <span class="p">}</span>
<a name="cl-539"></a>                <span class="k">else</span> <span class="p">{</span>
<a name="cl-540"></a>                    <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">byteLength</span><span class="p">);</span>
<a name="cl-541"></a>                <span class="p">}</span>
<a name="cl-542"></a>
<a name="cl-543"></a>                <span class="k">if</span> <span class="p">((</span><span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-544"></a>                    <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// byteOffset and length reference an area beyond the end of the buffer</span>
<a name="cl-545"></a>                <span class="p">}</span>
<a name="cl-546"></a>
<a name="cl-547"></a>                <span class="c1">// ES5-only magic</span>
<a name="cl-548"></a>                <span class="nx">configureProperties</span><span class="p">(</span><span class="k">this</span><span class="p">);</span>
<a name="cl-549"></a>            <span class="p">};</span>
<a name="cl-550"></a>
<a name="cl-551"></a>            <span class="k">if</span> <span class="p">(</span><span class="nx">ArrayBufferView</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-552"></a>                <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">ArrayBufferView</span><span class="p">();</span>
<a name="cl-553"></a>            <span class="p">}</span>
<a name="cl-554"></a>
<a name="cl-555"></a>            <span class="kd">function</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">arrayType</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-556"></a>                <span class="k">return</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">littleEndian</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-557"></a>                    <span class="cm">/*jslint newcap: false*/</span>
<a name="cl-558"></a>                    <span class="nx">byteOffset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">byteOffset</span><span class="p">);</span>
<a name="cl-559"></a>
<a name="cl-560"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-561"></a>                        <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// Array index out of range</span>
<a name="cl-562"></a>                    <span class="p">}</span>
<a name="cl-563"></a>                    <span class="nx">byteOffset</span> <span class="o">+=</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteOffset</span><span class="p">;</span>
<a name="cl-564"></a>
<a name="cl-565"></a>                    <span class="kd">var</span> <span class="nx">uint8Array</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Uint8Array</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">,</span> <span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">),</span>
<a name="cl-566"></a>                        <span class="nx">bytes</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">i</span><span class="p">;</span>
<a name="cl-567"></a>                    <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-568"></a>                        <span class="nx">bytes</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">r</span><span class="p">(</span><span class="nx">uint8Array</span><span class="p">,</span> <span class="nx">i</span><span class="p">));</span>
<a name="cl-569"></a>                    <span class="p">}</span>
<a name="cl-570"></a>
<a name="cl-571"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nb">Boolean</span><span class="p">(</span><span class="nx">littleEndian</span><span class="p">)</span> <span class="o">===</span> <span class="nb">Boolean</span><span class="p">(</span><span class="nx">IS_BIG_ENDIAN</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-572"></a>                        <span class="nx">bytes</span><span class="p">.</span><span class="nx">reverse</span><span class="p">();</span>
<a name="cl-573"></a>                    <span class="p">}</span>
<a name="cl-574"></a>
<a name="cl-575"></a>                    <span class="k">return</span> <span class="nx">r</span><span class="p">(</span><span class="k">new</span> <span class="nx">arrayType</span><span class="p">(</span><span class="k">new</span> <span class="nx">Uint8Array</span><span class="p">(</span><span class="nx">bytes</span><span class="p">).</span><span class="nx">buffer</span><span class="p">),</span> <span class="mi">0</span><span class="p">);</span>
<a name="cl-576"></a>                <span class="p">};</span>
<a name="cl-577"></a>            <span class="p">}</span>
<a name="cl-578"></a>
<a name="cl-579"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getUint8</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Uint8Array</span><span class="p">);</span>
<a name="cl-580"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getInt8</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Int8Array</span><span class="p">);</span>
<a name="cl-581"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getUint16</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Uint16Array</span><span class="p">);</span>
<a name="cl-582"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getInt16</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Int16Array</span><span class="p">);</span>
<a name="cl-583"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getUint32</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Uint32Array</span><span class="p">);</span>
<a name="cl-584"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getInt32</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Int32Array</span><span class="p">);</span>
<a name="cl-585"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getFloat32</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Float32Array</span><span class="p">);</span>
<a name="cl-586"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">getFloat64</span> <span class="o">=</span> <span class="nx">makeDataView_getter</span><span class="p">(</span><span class="nx">Float64Array</span><span class="p">);</span>
<a name="cl-587"></a>
<a name="cl-588"></a>            <span class="kd">function</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">arrayType</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-589"></a>                <span class="k">return</span> <span class="kd">function</span> <span class="p">(</span><span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">value</span><span class="p">,</span> <span class="nx">littleEndian</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-590"></a>                    <span class="cm">/*jslint newcap: false*/</span>
<a name="cl-591"></a>                    <span class="nx">byteOffset</span> <span class="o">=</span> <span class="nx">ECMAScript</span><span class="p">.</span><span class="nx">ToUint32</span><span class="p">(</span><span class="nx">byteOffset</span><span class="p">);</span>
<a name="cl-592"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nx">byteOffset</span> <span class="o">+</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span> <span class="o">&gt;</span> <span class="k">this</span><span class="p">.</span><span class="nx">byteLength</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-593"></a>                        <span class="nx">raise_INDEX_SIZE_ERR</span><span class="p">();</span> <span class="c1">// Array index out of range</span>
<a name="cl-594"></a>                    <span class="p">}</span>
<a name="cl-595"></a>
<a name="cl-596"></a>                    <span class="c1">// Get bytes</span>
<a name="cl-597"></a>                    <span class="kd">var</span> <span class="nx">typeArray</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">arrayType</span><span class="p">([</span><span class="nx">value</span><span class="p">]),</span>
<a name="cl-598"></a>                        <span class="nx">byteArray</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Uint8Array</span><span class="p">(</span><span class="nx">typeArray</span><span class="p">.</span><span class="nx">buffer</span><span class="p">),</span>
<a name="cl-599"></a>                        <span class="nx">bytes</span> <span class="o">=</span> <span class="p">[],</span> <span class="nx">i</span><span class="p">,</span> <span class="nx">byteView</span><span class="p">;</span>
<a name="cl-600"></a>
<a name="cl-601"></a>                    <span class="k">for</span> <span class="p">(</span><span class="nx">i</span> <span class="o">=</span> <span class="mi">0</span><span class="p">;</span> <span class="nx">i</span> <span class="o">&lt;</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">;</span> <span class="nx">i</span> <span class="o">+=</span> <span class="mi">1</span><span class="p">)</span> <span class="p">{</span>
<a name="cl-602"></a>                        <span class="nx">bytes</span><span class="p">.</span><span class="nx">push</span><span class="p">(</span><span class="nx">r</span><span class="p">(</span><span class="nx">byteArray</span><span class="p">,</span> <span class="nx">i</span><span class="p">));</span>
<a name="cl-603"></a>                    <span class="p">}</span>
<a name="cl-604"></a>
<a name="cl-605"></a>                    <span class="c1">// Flip if necessary</span>
<a name="cl-606"></a>                    <span class="k">if</span> <span class="p">(</span><span class="nb">Boolean</span><span class="p">(</span><span class="nx">littleEndian</span><span class="p">)</span> <span class="o">===</span> <span class="nb">Boolean</span><span class="p">(</span><span class="nx">IS_BIG_ENDIAN</span><span class="p">))</span> <span class="p">{</span>
<a name="cl-607"></a>                        <span class="nx">bytes</span><span class="p">.</span><span class="nx">reverse</span><span class="p">();</span>
<a name="cl-608"></a>                    <span class="p">}</span>
<a name="cl-609"></a>
<a name="cl-610"></a>                    <span class="c1">// Write them</span>
<a name="cl-611"></a>                    <span class="nx">byteView</span> <span class="o">=</span> <span class="k">new</span> <span class="nx">Uint8Array</span><span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">buffer</span><span class="p">,</span> <span class="nx">byteOffset</span><span class="p">,</span> <span class="nx">arrayType</span><span class="p">.</span><span class="nx">BYTES_PER_ELEMENT</span><span class="p">);</span>
<a name="cl-612"></a>                    <span class="nx">byteView</span><span class="p">.</span><span class="nx">set</span><span class="p">(</span><span class="nx">bytes</span><span class="p">);</span>
<a name="cl-613"></a>                <span class="p">};</span>
<a name="cl-614"></a>            <span class="p">}</span>
<a name="cl-615"></a>
<a name="cl-616"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setUint8</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Uint8Array</span><span class="p">);</span>
<a name="cl-617"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setInt8</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Int8Array</span><span class="p">);</span>
<a name="cl-618"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setUint16</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Uint16Array</span><span class="p">);</span>
<a name="cl-619"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setInt16</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Int16Array</span><span class="p">);</span>
<a name="cl-620"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setUint32</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Uint32Array</span><span class="p">);</span>
<a name="cl-621"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setInt32</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Int32Array</span><span class="p">);</span>
<a name="cl-622"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setFloat32</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Float32Array</span><span class="p">);</span>
<a name="cl-623"></a>            <span class="nx">DataView</span><span class="p">.</span><span class="nx">prototype</span><span class="p">.</span><span class="nx">setFloat64</span> <span class="o">=</span> <span class="nx">makeDataView_setter</span><span class="p">(</span><span class="nx">Float64Array</span><span class="p">);</span>
<a name="cl-624"></a>
<a name="cl-625"></a>        <span class="p">}</span> <span class="p">());</span>
<a name="cl-626"></a>    <span class="p">}</span>
<a name="cl-627"></a>
<a name="cl-628"></a><span class="p">}</span> <span class="p">());</span>
</pre></div>
</td></tr></table>
        </div>
      
    
  
  </div>
  


  <div id="mask"><div></div></div>

  </div>

      </div>
    </div>

  </div>

  <div id="footer">
    <ul id="footer-nav">
      <li>Copyright © 2012 <a href="http://atlassian.com">Atlassian</a></li>
      <li><a href="http://www.atlassian.com/hosted/terms.jsp">Terms of Service</a></li>
      <li><a href="http://www.atlassian.com/about/privacy.jsp">Privacy</a></li>
      <li><a href="//bitbucket.org/site/master/issues/new">Report a Bug to Bitbucket</a></li>
      <li><a href="http://confluence.atlassian.com/x/IYBGDQ">API</a></li>
      <li><a href="http://status.bitbucket.org/">Server Status</a></li>
    </ul>
    <ul id="social-nav">
      <li class="blog"><a href="http://blog.bitbucket.org">Bitbucket Blog</a></li>
      <li class="twitter"><a href="http://www.twitter.com/bitbucket">Twitter</a></li>
    </ul>
    <h5>We run</h5>
    <ul id="technologies">
      <li><a href="http://www.djangoproject.com/">Django 1.3.1</a></li>
      <li><a href="//bitbucket.org/jespern/django-piston/">Piston 0.3dev</a></li>
      <li><a href="http://git-scm.com/">Git 1.7.10.3</a></li>
      <li><a href="http://www.selenic.com/mercurial/">Hg 2.2.2</a></li>
      <li><a href="http://www.python.org">Python 2.7.3</a></li>
      <li>dd2f01151ad6 | bitbucket12</li>
      
    </ul>
  </div>

  <script src="https://dwz7u9t8u8usb.cloudfront.net/m/f9069c5afb50/js/old/global.js"></script>






  <script>
    BB.gaqPush(['_trackPageview']);
  
    BB.gaqPush(['atl._trackPageview']);

    

    

    (function () {
        var ga = document.createElement('script');
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        ga.setAttribute('async', 'true');
        document.documentElement.firstChild.appendChild(ga);
    }());
  </script>

</body>
</html>
