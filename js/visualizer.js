// // SVG 크기 설정
const width = 100 + "%";
const height = 100 + "%";
const nodeRadius = 20;

// SVG 요소 생성
let svg = d3
  .select("#visualization-area")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// 그룹 요소 생성
let g = svg.append("g").attr("transform", `translate(80, 160)`);

// 시각화 업데이트 함수
function updateVisualization(repoState) {
  // 기존 요소 모두 제거
  svg.selectAll("*").remove();

  // 그룹 요소 재생성
  g = svg.append("g").attr("transform", `translate(80, 160)`);

  if (!repoState.isInitialized) {
    svg
      .append("text")
      .attr("x", "50%")
      .attr("y", "50%")
      .attr("text-anchor", "middle")
      .text("저장소가 초기화되지 않았습니다.");
    return;
  }

  const commits = repoState.commits;

  // 노드 위치 계산
  const nodePositions = commits.map((_, i) => ({ x: i * 152, y: 0 }));

  // 링크 데이터 생성
  const links = commits.slice(1).map((commit, i) => ({
    source: nodePositions[i],
    target: nodePositions[i + 1],
  }));

  // 링크 그리기 (줄)
  g.selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y + 6)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y + 6)
    .attr("stroke", "#F74E27")
    .attr("stroke-width", 2);

  // 노드 그리기 (원)
  const nodes = g
    .selectAll(".node")
    .data(commits)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr(
      "transform",
      (d, i) => `translate(${nodePositions[i].x}, ${nodePositions[i].y + 6})`
    );

  nodes.append("circle").attr("r", nodeRadius).attr("fill", "#F74E27");

  // 커밋 ID
  nodes
    .append("text")
    .attr("dy", nodeRadius + 24)
    .attr("text-anchor", "middle")
    .text((d) => d.id.substring(0, 7));

  // 커밋 메시지 추가
  nodes
    .append("text")
    .attr("dy", nodeRadius + 44) // 커밋 ID 아래에 위치하도록 조정
    .attr("text-anchor", "middle")
    .text((d) => {
      // 커밋 메시지가 너무 길면 잘라내기
      const maxLength = 10;
      console.log(d);
      return d.message.length > maxLength
        ? d.message.substring(0, maxLength) + "..."
        : d.message;
    })
    .style("font-size", "12px") // 커밋 메시지의 폰트 크기를 작게 설정
    .call(wrap, 100); // 텍스트 줄바꿈 함수 호출 (아래에 정의 필요)

  // 브랜치 표시
  const branchData = Object.entries(repoState.branches)
    .map(([name, commitId]) => ({
      name,
      commitId,
      index: commits.findIndex((c) => c.id === commitId),
    }))
    .filter((b) => b.index !== -1);

  // 텍스트와 사각형 그룹화
  const branchGroup = g
    .selectAll(".branch-group")
    .data(branchData)
    .enter()
    .append("g")
    .attr("class", "branch-group")
    .attr("transform", (d) => `translate(${nodePositions[d.index].x}, -34)`);

  // 텍스트 추가
  const textElement = branchGroup
    .append("text")
    .attr("class", "branch")
    .attr("text-anchor", "middle")
    .style("fill", "#F74E27")
    .text((d) => d.name);

  // 텍스트의 크기를 기반으로 사각형 크기 설정
  branchGroup.each(function () {
    const textNode = d3.select(this).select("text").node();
    const bbox = textNode.getBBox(); // 텍스트의 경계 상자 가져오기

    // 사각형 추가
    d3.select(this)
      .insert("rect", "text")
      .attr("x", bbox.x - 10) // x패딩
      .attr("y", bbox.y - 5) // y패딩
      .attr("width", bbox.width + 20) // x패딩 포함한 너비
      .attr("height", bbox.height + 8) // y패딩 포함한 높이
      .attr("rx", 6)
      .attr("ry", 6)
      .style("fill", "#FFEEEA");
  });

  // 현재 브랜치 표시
  svg
    .append("text")
    .attr("x", 130)
    .attr("y", -19)
    .text(`${repoState.currentBranch}`);

  // 파일 상태 표시
  const fileStatus = svg
    .append("g")
    .attr("transform", `translate(10,10)`);

  //fileStatus.append("text")
  //.text(`Working Directory: ${repoState.files.join(", ")}`);

  //fileStatus.append("text")
  //.attr("y", 20)
  //.text(`Staging Area: ${repoState.staging.join(", ")}`);
}

// 텍스트 줄바꿈 함수
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy);
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy)
          .text(word);
      }
    }
  });
}

// 외부에서 사용할 함수 노출
window.updateVisualization = updateVisualization;
