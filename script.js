document.addEventListener("DOMContentLoaded", () => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(response => response.json())
        .then(data => {
            
            const gdpData = data.data;
            console.log(gdpData);

            const width = 800;
            const height = 400;
            const padding = 40;

            const xScale = d3
                .scaleTime()
                .domain(d3.extent(gdpData, d => new Date(d[0])))
                .range([padding, width - padding]);

            const yScale = d3
                .scaleLinear()
                .domain([0, d3.max(gdpData, d => d[1])])
                .range([height - padding, padding]);
            
            const xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat("%Y"))
                .ticks(10);

            const yAxis = d3.axisLeft(yScale)
                .ticks(10)
                .tickFormat(d => d);

            // Create the SVG container
            const svg = d3.select("main")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            // Append the x-axis
            svg.append("g")
                .attr("transform", `translate(${0}, ${height - padding})`)
                .call(xAxis);

            // Append the y-axis
            svg.append("g")
                .attr("transform", `translate(${padding}, ${0})`)
                .call(yAxis);

             // Add a tooltip for the bars
            const tooltip = d3.select("main")
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "tooltip-bar")
                .style("opacity", 0);  

            // Create bars for the GDP data
            svg.selectAll(".bar")
                .data(gdpData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(new Date(d[0])))
                .attr("y", d => yScale(d[1]))
                .attr("width", (width - padding) / (gdpData.length))
                .attr("height", d => (height - padding) - yScale(d[1]))
                .attr("fill", "steelblue")
                // Add mouseover event for tooltip
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(50)
                        .style("opacity", 1);
                    tooltip.html(`${d[0]}<br>$${d[1]} Billion`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 15) + "px");
                })
                .on("mouseout", function(d, i) {
                    tooltip.transition()
                        .duration(50)
                        .style("opacity", 0);
                })
                .append("title")
                .text(d => `${d[0]}, $${d[1]} Billion`);

                

            // Add a title to the chart
            svg.append("text")
                .attr("id", "title")
                .attr("x", width / 2)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text(data.name);

            // Add a source link
            svg.append("text")
                .attr("id", "source")
                .attr("x", width - 10)
                .attr("y", height - 10)
                .attr("text-anchor", "end")
                .style("font-size", "12px")
                .text("Source: " + data.source_name + " (" + data.display_url + ")");

                       
            
       
        });

            
    }
);