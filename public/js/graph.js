var url = "project_list.csv"




            d3.csv(url, function (error, data) {
               var mapped = data.map(function (d) {
                   return {
                       Region: d.region,
                       projectTitle: d.projectTitle,
                       federalContribution: +d.federalContribution,
                       location: d.location
                };

               });

               var shortData = [];
               var location = [];
               var projectTitle = [];
               var i;
                    for (i=0; i<mapped.length; i++) {
                        if (mapped[i].federalContribution  > 27000000 && mapped[i].federalContribution  < 80000000 && mapped[i].Region === 'on' ) {
                            /*shortData.push(mapped[i]);*/
                            if (mapped[i].location.length > 20) {
                                shortData.push({location:mapped[i].location.substring(0, 19)+'...', projectTitle:mapped[i].projectTitle, federalContribution:mapped[i].federalContribution, index:i
                               });
                                /*location.push(mapped[i]);*/

                            }
                            else {shortData.push({location:mapped[i].location, projectTitle:mapped[i].projectTitle, federalContribution:mapped[i].federalContribution, index:i
                               }) };

                            if (mapped[i].projectTitle.length > 20) {
                                projectTitle.push(mapped[i].projectTitle.substring(0, 19)+'...');
                                /*location.push(mapped[i]);*/

                            }
                            else {projectTitle.push(mapped[i].projectTitle) };

                        };


                    }; /*close for for loop*/
                /*console.log('here',shortData);
                console.log(data[shortData.index]);*/


                var fedCon = shortData.map (function (d) {
                    return +d.federalContribution;
                });



                var maxDollars = d3.max(fedCon);

                var margin = { top: 50, right: 10, bottom: 150, left: 150 };
                var graphWidth = 700, graphHeight = 250;

                var totalWidth = graphWidth + margin.left + margin.right;
                var totalHeight = graphHeight + margin.top + margin.bottom;

                var axisPadding = 3;

                var svg = d3.select('#main')
                    .append('svg')
                    .attr({ width: totalWidth, height: totalHeight });


                svg.append('rect').attr({
                width: totalWidth,
                height: totalHeight,
                fill: '#c0c0c0',
                stroke:'black',
                'stroke-width': 1
            });

                svg.append('text')
                    .attr('x', 400)
                    .attr('y', 30)
                    .attr('text-anchor', 'middle')
                    .style('fill', 'black')
                    .style('font-family', 'arial')
                    .style('font-size', '20')
                    .text('Top 17 Infrastructure Ontario Infrastructure Projects for 2016');

                svg.append('text')
                    .attr('x',40)
                    .attr('y', 200)
                    .attr('text-anchor', 'middle')
                    .style('fill', 'black')
                    .style('font-family', 'arial')
                    .style('font-size', '11')
                    .style('writing-mode', 'tb')
                    .style('glyph-orientation-vertical', '0')
                    .text('Federal Contribution in Dollars');

                svg.append('text')
                    .attr('x',120)
                    .attr('y', 380)
                    .attr('text-anchor', 'middle')
                    .style('fill', 'black')
                    .style('font-family', 'arial')
                    .style('font-size', '9')
                    .style('writing-mode', 'tb')
                    .style('glyph-orientation-vertical', '0')
                    .text('Project Title ');


               var gradient = svg.append('defs')
                    .append('linearGradient')
                    .attr('id', 'gradient')
                    .attr('x1', '0%')
                    .attr('y1', '100%')
                    .attr('x2', '0%')
                    .attr('y2', '0%');

                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('stop-color', '#fed6d4')
                    .attr('stop-opacity', 1);

                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('stop-color', '#7a0500')
                    .attr('stop-opacity', 1);

                var filter = svg.append('defs')
                .append('filter')
                    .attr('id', 'filter1')
                    .attr('x', '0')
                    .attr('y', '0')
                    .attr('width', '200%')
                    .attr('height', '200%');

                filter.append('feOffset')
                    .attr('result', 'offOut')
                    .attr('in', 'SourceAlpha')
                    .attr('dx', '10')
                    .attr('dy', '10');

                filter.append('feGaussianBlur')
                    .attr('result', 'blurOut')
                    .attr('in', 'offOut')
                    .attr('stdDeviation', '7');

                filter.append('feBlend')
                    .attr('in', 'SourceGraphic')
                    .attr('in2', 'blurOut')
                    .attr('mode', 'normal');


                var mainGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


                mainGroup.append('rect')
                    .attr({
                        fill: '#677a8b',
                        width: totalWidth - (margin.left + margin.right),
                        height: totalHeight - (margin.bottom + margin.top)

                });

                var graphBars = d3.scale.ordinal ()
                    .domain(fedCon)
                    .rangeBands([0, graphWidth], 0.06 );

                var yBar = d3.scale
                    .linear()
                    .domain([0, maxDollars])
                    .range([0, graphHeight]);

                function translator(d, i) {
                    return "translate(" + graphBars.rangeBand() * [i] + ","  + (graphHeight - yBar(d.federalContribution )) + ")";

                }

                var barGroup = mainGroup.selectAll('g')
                    .data(shortData)
                    .enter()
                    .append('g')
                    .attr('transform', translator)

                barGroup.append('rect')

                     .on('mouseover', function(d) {
                    d3.select(this).attr('fill', '#0f5960').style('opacity', '0.5');
                })

                    .on('mouseout', function(d) {
                    d3.select(this).attr('fill', 'url(#gradient)').attr('filter', 'url(#filter1)').style('opacity', '1');
                })

                    /*.on('click', function (d) {

                        d3.select('#dataHidden')
                            .attr('id', 'dataVisible')

                        d3.select('#dh2Hidden')
                            .attr('id', 'dh2Visible')

                        d3.select('#clseHidden')
                            .attr('id', 'clseVisible')

                        d3.select('#pnData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].projectNumber});

                         d3.select('#ptData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].projectTitle});

                        d3.select('#prgData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].program});

                        d3.select('#ctgyData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].category});

                        d3.select('#lctData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].location});

                        d3.select('#rgnData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].region});

                        d3.select('#appdData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].approvedDate});

                        d3.select('#csdData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].constructionStartDate});

                        d3.select('#cedData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].constructionEndDate});

                        d3.select('#fedData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].federalContribution});

                        d3.select('#tecData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].totalEligibleCost});

                        d3.select('#urData')
                            .append('text')
                            .data(shortData)
                            .text(function (d){return data[d.index].ultimateRecipient});*/
                /*console.log(d);
                console.log(data[d.index]);
                console.log(data[d.index].federalContribution);
                 console.log(data[d.index].ultimateRecipient);*/
                /*})*/ /*still working on*/





                    .attr({
                        width: graphBars.rangeBand() -3 ,
                        y: function (d) { return yBar(d.federalContribution ); },
                        height: 0
                })
                    .transition()
                    .delay(1000)
                    .duration(3000)

                    .attr({
                        fill: 'url(#gradient)',
                        width: graphBars.rangeBand() -3 ,
                        y: 0,
                        height: function (d) { return yBar(d.federalContribution ); },

                    })
                    .attr('filter', 'url(#filter1)');

               /* d3.select('#clseHidden').append('svg').append('rect')

                        .attr({
                            width: 30,
                            height: 30,
                     })
                        .style('fill', 'dimgray')
                        .text('X')
                        .style('text-align', 'center')
                        .style('margin', '1')
                        .on('click', function () {
                            d3.select('#dataVisible')
                            .attr('id', '#dataHidden')

                            d3.select('#dh2Visible')
                                .attr('id', '#dh2Hidden')

                            d3.select('#clseVisible')
                                .attr('id', '#clseHidden')

                    });*/  /*Working on this still*/




                var leftAxisGroup = svg.append('g')
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

                var lAxisNode = leftAxisGroup.call(leftAxis);
                styleAxisNodes(lAxisNode);



               barGroup.append('text')
                    .text(function(d) {return d.location;})
                    .style('text-anchor', 'start')
                    .style('opacity', 0)
                    .attr({
                        dx: 10,
                        dy: -10,
                        transform: "rotate(90)",
                        fill: 'black',
                        'stroke-width': 0.03,

                })

                    .transition()
                    .delay(4000)
                    /*.duration(3000)*/


                    .text(function(d) {return d.location;})
                    .style('text-anchor', 'start')
                    .style('opacity', 1)
                    .attr({
                        dx: 10,
                        dy: -10,
                        transform: "rotate(90)",
                        fill: 'black',
                        'stroke-width': 0.03,

                });


                var bottomAxisScale = d3.scale.ordinal ()
                    .domain(projectTitle)
                    .rangeBands ([axisPadding, graphWidth + axisPadding]);

                var bottomAxis = d3.svg
                    .axis ()
                    .scale(bottomAxisScale)
                    .orient ("bottom");

                var bottomAxisX = margin.left - axisPadding;
                var bottomAxisY = totalHeight - margin.bottom + axisPadding;

                var bottomAxisGroup = svg.append("g")
                    .attr ({ transform: 'translate(' + bottomAxisX + ',' + bottomAxisY + ')' });

                var bottomAxisNodes = bottomAxisGroup.call (bottomAxis);
                styleAxisNodes(bottomAxisNodes);

                bottomAxisNodes.selectAll("text")
                    .style('font-size', 14)
                    .style('text-anchor', 'start')
                    .attr({
                        dx: 10,
                        dy: -5,
                        transform: 'rotate(90)'
                });

                function styleAxisNodes(axisNodes) {
                    axisNodes.selectAll('.domain')
                        .attr ({
                            fill: 'none',
                            'stroke-width': 1,
                            stroke: 'black'
                    });
                axisNodes.selectAll('.tick line')
                    .attr({
                        fill: 'none',
                        'stroke-width': 0.5,
                        stroke: 'black'
                });


                };

                /*d3.select('#clseVisible')
                        .on('click', function () {
                            d3.select('#dataVisible')
                            .attr('id', '#dataHidden')

                            d3.select('#dh2Visible')
                                .attr('id', '#dh2Hidden')

                            d3.select('#clseVisible')
                                .attr('id', '#clseHidden')

                    });*/




            }); /*d3.csv tag end*/

