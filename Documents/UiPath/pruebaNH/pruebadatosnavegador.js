function(e) { 

    var resp= '';
    var errorStr = ''; 
    var data = {
                'country': '',  // Lo tengo
                'device': '',   // Lo indico desde ejecucion
                'name': '',     // Lo indico desde ejecucion
                'step': '',     // Lo indico desde ejecucion
                'url': '',      // Lo tengo
                'query': '',    // Se monta en ejecucion
                'query_date': '',   
                'first_byte_time': '',
                'on_load': '',
                'page_load_time': '',
                'image_load_time': '0',
                'css_load_time': '0',
                'js_load_time':'',
                'audio_load_time': '',
                'video_load_time': '',
                'html_load_time': '',
                'text_load_time': '',
                'requests': '',
                'total_size': '',
                'started_date_time': '' // MIO
            }
    function getAbsolutePath() {
        var loc = window.location;
        var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    }
    function sumaTiempos(tiempos){
        var total=0;
        for (i in tiempos){
            total+=parseInt(i);
        }
        return total;
    }
    function getTimes(entries){
       var tiempo=[];
       for (i in entries){
            tiempo.push(i.duration);
       }
       return sumaTiempos(tiempo);
            
    }
    function httpGetAsync(theUrl, callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", theUrl, false); // true for asynchronous 
        xmlHttp.send(null);
    }

    httpGetAsync("https://api.teletext.io/api/v1/geo-ip",function (respuesta){
      resp=JSON.parse(respuesta);
      data.country=resp.name;
    })
      

    data.url=getAbsolutePath();
    data.first_byte_time=window.performance.timing.responseStart - window.performance.timing.fetchStart;
    data.on_load=window.performance.timing.loadEventStart - window.performance.timing.fetchStart;
    data.page_load_time= window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;
    data.requests=window.performance.getEntriesByType('resource').length;
    var entradas_css= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="css"});
    data.css_load_time=getTimes(entradas_css);
    var entradas_img= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="img"});
    data.image_load_time=getTimes(entradas_img);
    var entradas_js= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="script"});
    data.js_load_time=getTimes(entradas_js);
    var entradas_html= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="xmlhttprequest"});
    data.html_load_time=getTimes(entradas_html);
    var entradas_link= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="link"});
    data.video_load_time=getTimes(entradas_link);
    var entradas_text= window.performance.getEntriesByType('resource').filter(function (entry){ return entry.initiatorType==="text/html"});
    data.text_load_time=getTimes(entradas_text);


    var navigation=window.performance.getEntriesByType('navigation');
    data.total_size=navigation[0].decodedBodySize;
    /*
    var resources = window.performance.getEntries();
    var html_entries = resources.filter({content_type="html"});
    var js_entries = resources.filter({content_type=".*javascript|.*json"});
    var text_entries = resources.filter({content_type="text.*"});
    var entries = html_entries + js_entries + text_entries;

    var started_date_time = entries[0]['startedDateTime'];*/

  /*  for each (entry in entries){
        if not (entry['response']['status'] >= 300 and entry['response']['status'] <= 399):
                var filter_entries.append(entry);
    }

    times = []
        for k, v in filter_entries['timings'].items():
            if k != 'receive':
                times.append(v)
*/
    return JSON.stringify(data);
    
}
