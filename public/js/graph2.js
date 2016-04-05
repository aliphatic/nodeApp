var url = "project_list.csv";

    d3.csv(url, function (error, data) {
        data.forEach (function (d) {
            d.federalContribution = +d.federalContribution

        }); /*close tag data.forEach*/

        var parsedData = [], federalContribution = [], location = [];

        for (i=0; i<data.length; i++) {
            if (data[i].federalContribution > 27000000 && data[i].federalContribution < 80000000 && data[i].region === 'on') {
                location.push(data[i].location);
                federalContribution.push(data[i].federalContribution);
                parsedData.push(data[i]);
            };

        }; /* close tag for loop*/

        var maxDollars = d3.max(federalContribution);

        var margin = { top: 10, right: 10, bottom: 260, left: 85 };

        var graphWidth = 500, graphHeight = 300;

        var totalWidth = graphWidth + margin.left + margin.right;
        var totalHeight = graphHeight + margin.top + margin.bottom;

        var axisPadding = 3;

        var svg = d3.select('#main')
            .append('svg')
            .attr ({ width: totalWidth, height: totalHeight });

        var mainGroup = svg
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var bands = d3.scale.ordinal()
            .domain(federalContribution)
            .rangeRoundBands([0, graphWidth], 0.03);

        var yScale = d3.scale
            .linear()
            .domain([0, maxDollars])
            .range([0, graphHeight]);
        var z = 9;
        function translator(federalContribution, i ) {
            return "translate(" + bands.range()[i] + "," + (graphHeight - yScale(federalContribution)) + ")";
        }

        var barGroup = mainGroup.selectAll('g')
            .data(federalContribution)
            .enter()
            .append('g')
            .attr('transform', translator);

        barGroup.append('rect')
            .attr({
                fill: 'steelblue',
                width: bands.rangeBand(),
                height: function(federalContribution) {return yScale(federalContribution);}
        });

        barGroup.append('text')
            .text(function (location) {return location })
            .style('text-anchor', 'start')
            .attr({
                locationx: 10,
                locationy: -10,
                transform: 'rotate(90)',
                fill: 'white'
        });

        var leftAxisGroup = svg.append('g');
        leftAxisGroup.attr({
            transform: 'translate(' + (margin.left - axisPadding) + ',' + margin.top + ')'
         });

        var yAxisScale = d3.scale
            .linear()
            .domain([maxDollars, 0])
            .range([0, graphHeight]);

        var leftAxis = d3.svg.axis()
            .orient('left')
            .scale(yAxisScale);

        var leftAxisNodes = leftAxisGroup.call(leftAxis);
        styleAxisNodes(leftAxisNodes);

        var project = parsedData.project;
        var bottomAxisScale = d3.scale.ordinal()
            .domain(project)
            .rangeBands([axisPadding, graphWidth + axisPadding]);

        var bottomAxis = d3.svg
            .axis()
            .scale(bottomAxisScale)
            .orient('bottom');

        var bottomAxisX = margin.left - axisPadding;
        var bottomAxisY = totalHeight - margin.bottom + axisPadding;

        var bottomAxisGroup = svg.append('g')
            .attr({ transform: 'translate(' + bottomAxisX + ',' + bottomAxisY + ')' });

        var bottonAxisNodes = bottomAxisGroup.call(bottomAxis);
        styleAxisNodes(bottonAxisNodes);

        bottomAxisNodes.selectAll('text')
            .style('text-anchor', 'start')
            .attr({
                x:10,
                y: -5,
                transform: 'rotate(90)'
        });

        function styleAxisNodes(axisNodes) {
            axisNodes.selectAll('.domain')
                .attr({
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: 'black'
            });

            axisNodes.selectAll('.tick line')
                .attr({
                    fill: 'none',
                    'stroke-width': 1,
                    stroke: 'black'
            });
        }


    }); /*end tag for d3.csv*/
