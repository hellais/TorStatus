// ~ models/relay ~
define([
  'jquery',
  'underscore',
  'backbone',
  'helpers'
], function($, _, Backbone){

	var relayModel = Backbone.Model.extend({
        baseurl: 'http://85.214.195.203',
        fingerprint: '',
        parseflags: function(flags, size) {
            var output = [];
            var model = this;
            _.each(flags, function(flag, model) {
                if (flag == "Authority") {
                    output.push([flag,"award_stroke_"+size[2]]);
                }
                if (flag == "Fast") {
                    output.push([flag,"bolt_"+size[0]]);
                }
                if (flag == "Guard") {
                    output.push([flag,"share_"+size[0]]);
                }
                if (flag == "HSir") {
                    output.push([flag,"book_alt_"+size[0]]);
                }
                if (flag == "Named") {
                    output.push([flag,"info_"+size[2]]);
                }
                if (flag == "Running") {
                    output.push([flag,"fork_"+size[1]]);
                }
                if (flag == "Stable") {
                    output.push([flag,"cd_"+size[0]]);
                }
                if (flag == "V2Dir") {
                    output.push([flag,"book_"+size[1]]);
                }
                if (flag == "Valid") {
                    output.push([flag,"check_alt_"+size[0]]);
                }
                if (flag == "Unnamed") {
                    output.push([flag,"question_mark_"+size[2]]);
                }
                if (flag == "Exit") {
                    output.push([flag,"cloud_download_"+size[0]]);
                }

            });
            return output;
        },
        parsedate: function(utctime) {
            var hr_magic = [10];
            var t = utctime.split(" ");
            var utcd = t[0].split("-");
            var utct = t[1].split(":");
            var d = new Date(utcd[0], utcd[1]-1, utcd[2], utct[0], utct[1], utct[2]);
            var now = new Date();
            var diff = now-d;
            var secs = Math.round(diff/1000);
            var mins = Math.floor(secs/60);
            var hours = Math.floor(mins/60);
            var days = Math.floor(hours/24);
            // XXX check if this formula is correct.
            secs = secs % 60;
            mins = mins % 60;
            hours = hours % 24;
            // console.log("secs: "+secs);
            // console.log("mins: "+mins);
            // console.log("hours: "+hours);
            // console.log("days: "+days);
            var hr_date = "";
            var hr_date_full = "";
            var hr = 0;
            if (days > 0) {
                hr_date += days + "d ";
                hr += 1;
                if (days > 1) {
                    hr_date_full += days + " days ";
                } else {
                    hr_date_full += days + " day ";
                }
            }

            if (hours > 0) {
                hr_date += hours + "h ";
                hr += 1;
                if (hours > 1) {
                    hr_date_full += hours + " hours ";
                } else {
                    hr_date_full += hours + " hour ";
                }
            }


            if (mins > 0) {
                if (hr < 2) {
                    hr_date += mins + "m ";
                    hr += 1;
                }
                if (hours > 1) {
                    hr_date_full += mins + " minutes ";
                } else {
                    hr_date_full += mins + " minute ";
                }
            }

            if (hr < 2) {
                hr_date += secs + "s ";
                hr += 1;
            }
            if (hr > 1) {
                hr_date_full += "and ";
            }
            if (secs > 1) {
                hr_date_full += secs + " seconds";
            } else {
                hr_date_full += secs + " second";
            }
            var output = {hrfull: hr_date_full, hr: hr_date, millisecs: diff};
            return output

        },
        lookup: function(options) {
            var success = options.success;
            var model = this;
            $.getJSON(this.baseurl+'/details/lookup/'+this.fingerprint, function(data) {
                var relay = data.relays[0];
                //console.log(data);
                var bw = relay.advertised_bandwidth;
                relay.bandwidth = bw;
                relay.bandwidth_hr = hrBandwidth(bw);
                relay.countryname = CountryCodes[relay.country];
                relay.uptime = model.parsedate(relay.last_restarted);
                relay.uptime_hr = relay.uptime.hr;
                //console.log(relay.uptime.hrfull);
                relay.uptime_hrfull = relay.uptime.hrfull;
                relay.uptime = relay.uptime.millisecs;
                var size = ['16x16', '14x16', '8x16'];
                relay.flags = model.parseflags(relay.flags, size);
                model.set(relay, options);
                success(model, relay);
            });
        }

	});

	return relayModel;
});

