// Define the dimensions of the scatter plot
var width = 800;
var height = 600;
var margin = { top: 40, right: 20, bottom: 30, left: 100 };

// Create an SVG element to contain the scatter plot
var svg = d3.select("#scatter-plot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load the CSV data
d3.csv("insurance.csv").then(function(data) {
    // Convert numerical columns to numbers (if needed)
    data.forEach(function(d) {
        d.bmi = +d.bmi;
        d.charges = +d.charges;
    });

    // Define scales for x and y axes
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.bmi), d3.max(data, d => d.bmi)])
        .range([margin.left, width - margin.right]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.charges), d3.max(data, d => d.charges)])
        .range([height - margin.bottom, margin.top]);

    // Create circles for each data point, color-coded by smoker status
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.bmi))
        .attr("cy", d => yScale(d.charges))
        .attr("r", 5) // Adjust the radius as needed
        .style("fill", d => d.smoker === "yes" ? "red" : "blue");

    // Add x and y axes
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale));

    // Add axis labels and title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .style("text-anchor", "middle")
        .text("BMI");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", margin.left -50)
        .style("text-anchor", "middle")
        .text("Insurance Charges");

        
// Add a legend
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 120) + "," + (margin.top + 10) + ")");

legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "red"); // Red for smokers

legend.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text("Smoker");

legend.append("rect")
    .attr("y", 25)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", "blue"); // Blue for non-smokers

legend.append("text")
    .attr("x", 24)
    .attr("y", 34)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text("Non-Smoker");


    // You can add more features, tooltips, or interactions as needed
}).catch(function(error) {
    console.log(error);
});
