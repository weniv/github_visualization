document.addEventListener("DOMContentLoaded", () => {
  const commandButtons = document.querySelectorAll(".command-panel button");
  const outputPanel = document.getElementById("command-output");
  const commandText = document.getElementById("command-text");
  const refreshBtn = document.querySelector(".btn-refresh");

  function refresh() {
    location.reload();
  }

  refreshBtn.addEventListener("click", refresh);

  // 명령어 버튼 이벤트 리스너 등록
  commandButtons.forEach((button) => {
    button.addEventListener("click", handleCommandClick);
  });

  // 명령어 버튼 클릭 핸들러
  function handleCommandClick(event) {
    const command = event.target.id.replace("btn-", "");
    let result;
    let fileName;

    switch (command) {
      case "init":
      case "status":
      case "log":
        result = executeGitCommand(command);
        break;
      case "create-file":
        fileName = commandText.value.trim();
        if (fileName) {
          result = createFileAction(fileName);
          // 해당 result는 gitCommands.js로 전송됩니다.
          commandText.value = "";
        } else {
          result = { success: false, message: "파일 이름을 입력해주세요." };
        }
        break;
      case "add":
        result = executeGitCommand(
          "add",
          commandText.value !== "" ? commandText.value : "."
        );
        commandText.value = "";
        break;
      case "commit":
        const message = commandText.value.trim();
        if (message) {
          result = executeGitCommand("commit", message);
          commandText.value = "";
        } else {
          result = { success: false, message: "커밋 메시지를 입력해주세요." };
        }
        break;
      case "push":
        result = executeGitCommand("push");
        break;
      case "pull":
        result = executeGitCommand("pull", commandText.value);
        commandText.value = "";
        break;
      case "branch":
        result = executeGitCommand("branch", commandText.value);
        commandText.value = "";
        break;

      case "clone":
        result = executeGitCommand("clone");
        break;
      case "checkout":
        result = executeGitCommand("checkout", commandText.value);
        commandText.value = "";
        break;
      case "amend":

      // case 'add':
      //
      // case 'commit':
      //
      // case 'push':
      //
      // case 'create-file':
      //     const fileName = commandText.value.trim();
      //     if (fileName) {
      //         result = createFile(fileName);
      //         commandText.value = '';
      //     } else {
      //         result = { success: false, message: '파일 이름을 입력해주세요.' };
      //     }
      //     break;
    }

    displayResult(result);
    updateVisualization(getCurrentRepoState());
  }

  // 결과 표시 함수
  function displayResult(result) {
    alert(result.message);
    outputPanel.textContent = result.message;
    outputPanel.style.color = result.success ? "green" : "red";
  }

  // 초기 시각화
  updateVisualization(getCurrentRepoState()); // 이 줄을 추가합니다.
});
