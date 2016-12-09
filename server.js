var express = require('express');
var fs = require('fs');
var app = express();

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/file', function (req, res) {
    fs.readFile(req.query.f, function (err, data) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end('failed');
        }

        res.writeHead(200);
        res.write(data);
        res.end();
    });
});

// Returns an array of JSON objects for a BGAME file
// This data can be used to create a boxscore
app.get('/boxscore', function (req, res) {
    var Converter = require("csvtojson").Converter;
    var converter = new Converter({
        noheader: true,
        headers: getBGAMEHeaders()
    });
    
    fs.readFile(req.query.f, function (err, data) {
        if (err) {
            console.log('read file error occurred');
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('read file failed');
        } else {
            var jsonStr = data.toString();
            converter.fromString(jsonStr, function (csv_err, result) {
                if (csv_err) {
                    console.log('Convert error occurred');
                    console.log(csv_err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('convert failed');
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(result));
                res.end();
            });
        }
        
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

// These are the headers for the fields in the BGAME files
// Source: http://www.retrosheet.org/datause.txt (scroll to BGAME section)
function getBGAMEHeaders() {
    return [
        "game_id",
        "date",
        "game_number",
        "day_of_week",
        "start_time",
        "DH_used_flag",
        "day_night_flag",
        "visiting_team",
        "home_team",
        "game_site",
        "vis_starting_pitcher",
        "home_starting_pitcher",
        "home_plate_umpire",
        "first_base_umpire",
        "second_base_umpire",
        "third_base_umpire",
        "left_field_umpire",
        "right_field_umpire",
        "attendance",
        "PS_scorer",
        "translator",
        "inputter",
        "input_time",
        "edit_time",
        "how_scored",
        "pitches_entered",
        "temperature",
        "wind_direction",
        "wind_speed",
        "field_condition",
        "precipitation",
        "sky",
        "time_of_game",
        "number_of_innings",
        "visitor_final_score",
        "home_final_score",
        "visitor_hits",
        "home_hits",
        "visitor_errors",
        "home_errors",
        "visitor_left_on_base",
        "home_left_on_base",
        "winning_pitcher",
        "losing_pitcher",
        "save_for",
        "GW_RBI",
        "visitor_batter_1",
        "visitor_position_1",
        "visitor_batter_2",
        "visitor_position_2",
        "visitor_batter_3",
        "visitor_position_3",
        "visitor_batter_4",
        "visitor_position_4",
        "visitor_batter_5",
        "visitor_position_5",
        "visitor_batter_6",
        "visitor_position_6",
        "visitor_batter_7",
        "visitor_position_7",
        "visitor_batter_8",
        "visitor_position_8",
        "visitor_batter_9",
        "visitor_position_9",
        "home_batter_1",
        "home_position_1",
        "home_batter_2",
        "home_position_2",
        "home_batter_3",
        "home_position_3",
        "home_batter_4",
        "home_position_4",
        "home_batter_5",
        "home_position_5",
        "home_batter_6",
        "home_position_6",
        "home_batter_7",
        "home_position_7",
        "home_batter_8",
        "home_position_8",
        "home_batter_9",
        "home_position_9"
    ];
}