# [HualuCup](http://www.dcjingsai.com/common/cmpt/%E5%9F%8E%E5%B8%82%E6%B2%BB%E7%90%86%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%BA%94%E7%94%A8%E5%88%9B%E6%84%8F%E6%96%B9%E6%A1%88%E8%B5%9B_%E7%AB%9E%E8%B5%9B%E4%BF%A1%E6%81%AF.html): Open Data Innovation Competition

### 07/27/2018 Fri
work from 20:00 - 4:00
Data Specification for web demo:  
1. in `json` format, named as following:  
    1. `[day]_[weather]_[time]`, i.e. `weekday_rainy_600`    
    1. `[day]_[weather]`, i.e. `weekday_rainy`, with time data is listed in the file  
1. **6** fields in a json file for each time  
    ```bash
    {"map":[
        {
        "n_line":       10,             # number of bus lines
        "n_stops":      [4,5,...],       # number of stops in each bus line
        "names":        # name info of line1, line2, ..., line n
                        [
                        ['骚子营','奶子房','磁器口','八王坟'],  # list of stop names, 0..3
                        ...
                        ],  
        "coordinates":  # coordinate info of line1, line2, ..., line n
                        [
                        [10,10, 300,300, 200,600, 1600,1100],  # list of stop coordinates, 0..3
                        ...
                        ],
        "index_up":     # up traffic index info of line1, line2, ..., line n-1
                        [ [               # time = 0(6:00)
                            [10,30,80],   # list of traffic index in each segment, 0..2
                            [5,5,5,7]
                            ...
                          ],[             # time = 1(7:00)
                            [10,30,80],   # list of traffic index in each segment, 0..2
                            [5,5,5,7]
                            ...
                          ],
                          ...
                        ]   # [time [line]] or [line [time]]?
        "index_down":   # down traffic index info of line1, line2, ..., line n-1
                        [ [               # time = 0(6:00)
                            [40,60,99],   # list of traffic index in each segment, 0..2
                            [80,50,30],
                            ...
                          ],[             # time = 1(7:00)
                            [40,60,99],   # list of traffic index in each segment, 0..2
                            [80,50,30,40],
                            ...
                          ],
                          ...                           
                        ]   # [time [line]] or [line [time]]?
        }
    ]}
    ```
    **question**: [time [line]] or [line [time]]?  
1. data allocation

    info | val
    ---|---
    number of lines| `data.lines`
    number of stops in line *i*(from 0)| `data.stops[i]`
    number of segments in line *i*(from 0)| `data.stops[i]-1`
    position of stop *j*(from 0) of line *i*(from 0)| `(data.coordinates[i][2*j], data.coordinates[i][2*j+1])`
    traffic index of from stop <br>\[*j,j+1*\] (j from 0) of line *i*(from 0)| `data.index_up[i][j]`

### 07/28/2018 Sat
work from 12:30 - 0:52
1. [Gradual change of line color](https://blog.csdn.net/phker/article/details/44401493)
1. add animation of traffic flow, inspired from [post1](http://www.webhek.com/post/animated-line-drawing-in-svg.html) and [post2](http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html)
1. add functionality of line highlight in map
1. add argument for `onclick` event for a DOM: use **string** instead of variable for the whole function call


### 07/29/2018 Sun
work from 16:00-23:00 periodically
1. add highlight of starting stop in table
1. no flow for many-stop display
1. remove dash attribute in segments:
```javascript
var dashLength = 25;
stroke-dasharray:dashLength+" "+dashLength
```
1. naming and reorganizing the data file:
    4 data files: `weekdays_regular.dat`, `weekdays_rainy`, `weekends_regular.dat`, `weekends_rainy`

### 07/30/2018 Mon
1. enable the button of reset table. 
1. add line break of stop names displayed in map  
    1. svg 1.1 doesn't support line break (`<br>` in innerHTML doesn't work)  
    1. solution: use `first_line<tspan x=? y=? dx=? dy=?>second_line</tspan>` in innerHTML of `svg.text` obj, here, I only use `x=x0` and `dy=15` to locate the new line.  
1. adjust the fontSize of stop names displayed  
1. adjust the fontStyle of line nemas displayed
1. shift the svg block to right to show tooltips of leftmost dots
