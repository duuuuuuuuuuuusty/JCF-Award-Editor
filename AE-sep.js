/* Award Editor version like.. -.09. Support Thread: http://forum.jcink.com/index.php?showtopic=26623 */
   $('#logbtn').click(function() {
       $.get("/admin.php?login=yes", {
           username: $('#logusn').val(),
           password: $('#logpw').val()
       }, function(data) {
           var fmark = data.search("adsess="),
               fin = data.substr(fmark + 7, 32);
           $("#acpid").val(fin);
           $("#logbtn").val('Signed In');
           $("#getdata").css('display', 'unset');
       })
   });
   $(document).on("click", "input#getdata", function _createdata() {
       $('#result').val('Requesting award table - Hang onto your butts!');
       _sleep(20);
       var ads = $('#acpid').val(),
           m = 'GET',
           um = '/admin.php?',
           dm = {
               act: 'mysql',
               adsess: ads,
               code: 'dump',
               line: '0',
               part: '8'
           },
           s = 'false',
           good = function() {
               $('#result').val('MySQL dump created, requesting MID table')
               _addMID(ads);
           },
           bad = $('#result').val('Creation failed');
       _asyncupload(m, um, dm, s, good, bad);
   });
   $(document).on("click", "span.uploadind", function _singleupload() {
       da = {};
       var count = 0,
           parent = $(this).parent('.toupload');
       $.each($(parent).find('input:not(.cell2)'), function() {
           count = count + 1;
           da[count] = ($(this).val());
       });
       da[6] = parent.find('select.cell7').val();
       da[7] = parent.find('input.evalme.cell2').attr('default');
       console.log(da);
       _upload(da);
       $('#result').val('Award #' + parent.attr('id') + ' - Sent');
       parent.removeClass('toupload').children('.controls').remove();
   });
   $(document).on("click", "span.uploadcan", function _cancelrow() {
       var parent = $(this).parent('.toupload');
       $.each($(parent).find('input:not(.cell2), select'), function() {
           var def = $(this).attr('default');
           $(this).attr('value', def);
       });
       parent.removeClass('toupload').children('.controls').remove();
       $('#result').val('Award #' + parent.attr('id') + ' - Reset');
   });
   $(document).on("click", "#pt_se", function _massup() {
       $.each($('.toupload'), function() {
           dm = {};
           var count = 0,
               t = $(this);
           $.each(t.find('input:not(.cell2)'), function _apply(count) {
               var count = count + 1;
               dm[count] = ($(this).val());
           });
           dm[6] = t.find('select.cell7').val();
           dm[7] = t.find('input.evalme.cell2').attr('default');
           console.log(dm);
           _upload(dm);
           t.find('.controls').remove();
           t.removeClass('toupload');
       });
   });
   $(document).on("click", ".rmrow", function _markfordeletion() {
       $(this).parent('td').parent('tr').toggleClass('toremove');
       $(this).toggleClass('rmicon');
   });
   $('#rmsel').click(function _deleteenmasse() {
       console.log('Running delete..');
       var ads = $('#acpid').val();
       $.each($('.toremove'), function() {
           $.get("/admin.php?adsess=" + ads + "&act=awards&code=awardsdelete", {
               id: $(this).find('.cell1').val()
           }, function() {
               $('#result').val('Awards deleted');
               $('.toremove').addClass('removed').removeClass('toremove');
           })
       });
   });
   $('#swapandgo').click(function _replace() {
       var type = $('#replacemenu').val(),
           controls = $('<span class="uploadind controls">☑</span> <span class="uploadcan controls">☒</span>'),
           find = $('#findme').val(),
           replace = $('#replaceme').val();
       $('.cell' + type + '[value="' + find + '"]').val(replace).parent('td').parent('tr').addClass('toupload').append(controls);
   });
   $('#sortgo').click(function _sortact() {
       var opt = [$('#sortmenu').val(), $('#sortphrase').val()]
       $('#mass tr').css({'position': 'unset', 'top':'unset'});
       console.log(opt);
       _sort(opt);
   });
   $('#clearsort').click(function _clearsearch() {
       $('#mass tr').css({'position': 'unset', 'top':'unset'});
   });

   function _addMID(ads) {
       var m = 'GET',
           um = '/admin.php?',
           dm = {
               act: 'mysql',
               adsess: ads,
               code: 'dump',
               line: '0',
               part: '37'
           },
           s = 'false',
           good = function() {
               $('#result').val('MID table dump created, downloading (4s delay)..');
               _getdata(ads);
           },
           bad = $('#result').val('Creation failed');
       _asyncupload(m, um, dm, s, good, bad);
   }

   function _getdata(ads) {
       console.log('Beginning download ')
       _sleep(4000);
       var m = 'GET',
           url = window.location.host,
           ind = url.indexOf('.'),
           split = url.substring(0, ind),
           um = '/boardservice/sqls/' + ads + '-' + split + '_.sql',
           dm = {},
           s = 'false',
           good = function(data) {
               _datasplit(data);
               $('#result').val('Downloaded data');
           },
           bad = $('#result').val('Download failed');
       _asyncupload(m, um, dm, s, good, bad);
   }

   function _datasplit(data) {
       var results = data.split(/\n/g),
           str = '_members` VALUES (';
       console.log(results);
       var supres = searchStringInArray(str, results);
       console.log(supres);
       var aid = results.slice(0, supres),
           mid = results.slice(supres);
       console.log(aid)
       console.log(mid)
       $('#result').val('Data split, sending block 1 to parser..');
       _parser(aid, mid)
   }

   function searchStringInArray(str, strArray) {
       for (var i = 0; i < strArray.length; i++) {
           if (strArray[i].indexOf(str) != -1) {
               break;
           }
       }
       return i;
   }

   function _parser(aid, mid) {
       $('#result').val('Block 1 received, parsing..');
       _sleep(1000);
       var count = 1;
       console.log(aid);
       if ($('table#mass tbody tr').attr('id') != 'undefined') {
           $(this).remove()
       }
       $.each(aid, function _tablebuilder() {
           var table = document.getElementById("mass").insertRow(1),
               t = this,
               arr = t.substring(t.indexOf('(') + 1, t.lastIndexOf(')')).match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g),
               arr = arr || [];
           table.id = 't' + count++;
           var arrayLength = arr.length - 1;
           for (var i = 0; i < arrayLength; i++) {
               arr[i] = arr[i].replace(/^"/, '').replace(/"$/, '').replace(/'/g, '&#39;').replace(/"/g, '&#34;');
               table.insertCell(i).innerHTML = "<input type='text' class='evalme cell" + (i + 1) + "' default='" + arr[i] + "' value='" + arr[i] + "'>";
           }
           console.log(arr);
           if (arr[6] > 0) {
               table.insertCell(-1).innerHTML = "<select class='cell7' default='" + arr[6] + "'><option value='1' selected>Yes</option><option value='0'>No</option></select>";
           } else {
               table.insertCell(-1).innerHTML = "<select class='cell7' default='" + arr[6] + "'><option value='1'>Yes</option><option value='0' selected>No</option></select>";
           }
           table.insertCell(-1).innerHTML = "<div class='rmrow'>✗</div>";
       });
       $('.cell1, .cell2').attr('readonly', '');
       if ($("tr#t1").length > 0) {
           $('#result').val('Awards data tabulated');
       } else {
           $('#result').val('Error: Data not detected - Reload');
       }
       _midparse(mid)
       _markforupload();
   };

   function _midparse(mid) {
       $('#result').val('Block 2 received, parsing..');
       var supabig = {},
           idtable = $('input.evalme.cell2');
       $.each(mid, function() {
           var t = this,
               id = t.substring(t.indexOf('(') + 1, t.indexOf('", ')).split(', "'),
               id = id || [];
           supabig[id[0]] = id[1];
       });
       $.each(idtable, function() {
           var t = $(this),
               check = t.val();
           t.val($("<div>").html(supabig[check]).text());
       });
       $('#result').val('All data parsed');
   };

   function _markforupload() {
       $(".cell3, .cell4, .cell5, .cell6, .cell7").focusout(function() {
           var parenttr = $(this).parent("td").parent("tr").attr("id"),
               change = $(this).val(),
               controls = $('<span class="uploadind controls">☑</span> <span class="uploadcan controls">☒</span>'),
               def = $(this).attr("default");
           console.log('row ' + parenttr + ' has lost focus');
           if (change != '' && change != def) {
               $('#' + parenttr).addClass("toupload").append(controls);
               console.log('row ' + parenttr + ' marked for upload');
           } else {
               $('#' + parenttr).removeClass("toupload").children('.controls').remove();
               console.log('row ' + parenttr + ' unmarked for upload');
           }
       });
   };

   function _sort(opt) {
 $('.cell' + opt[0] + ':not(.cell' + opt[0] + '[value="' + opt[1] + '"])').parent('td').parent('tr').css({'position': 'absolute', 'top':'-1000px'});
   }

   function _upload(data) {
       acpsess = $('#acpid').val();
       console.log('Uploading with dataset: ')
       console.log(data)
       $.ajax({
           method: "POST",
           url: '/admin.php?adsess=' + acpsess + '&code=do_awardsedit&act=awards',
           timeout: 8000,
           data: {
               id: data[1],
               mid: data[7],
               name: data[2],
               image: data[3],
               givenby: data[4],
               description: data[5],
               display: data[6]
           },
           success: function() {
               $('#result').val('Award #' + data[1] + ' - Sent');
               $('tr#t' + data[1] + '').removeClass('toupload').children('.controls').remove();

           },
           error: function(String, errorThrown) {
               $('#result').va('Award #' + data[1] + ': Upload failed!')
           }
       });
   };

   function _asyncupload(m, um, dm, s, good, bad) {
       var acpsess = $('#acpid').val();
       $.ajax({
           method: m,
           url: um,
           timeout: 8000,
           data: dm,
           async: s,
           success: good,
           error: bad,
           statusCode: {
               200: $('#result').val('200 OK - Sending'),
               404: $('#result').val('404 not found - Halted - Retrying if possible')
           }
       });
   }

   function _sleep(milliseconds) {
       var start = new Date().getTime();
       for (var i = 0; i < 1e7; i++) {
           if ((new Date().getTime() - start) > milliseconds) {
               break;
           }
       }
   }
