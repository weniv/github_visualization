// 가상의 Git 저장소 상태를 관리할 객체
let repoState = {
  isInitialized: false,
  files: [],
  staging: [],
  commits: [],
  currentBranch: "main",
  branches: { main: null },
  trackedFiles: {}, // 파일 이름을 키로, 마지막 커밋 이후 변경 여부를 값으로 가집니다.
};

// 화면 우측 Git 상태표시 영역의 id값
const elements = [
  "status-text-working",
  "status-text-staging",
  "status-text-local",
  "status-text-remote",
  "status-dot-working",
  "status-dot-staging",
  "status-dot-local",
  "status-dot-remote",
].map((id) => document.getElementById(id));

const [
  viewGitInnerTextWorking,
  viewGitInnerTextStaging,
  viewGitInnerTextLocal,
  viewGitInnerTextRemote,
  dotWorking,
  dotStaging,
  dotLocal,
  dotRemote,
] = elements;

// 화면 우측의 Git 상태표시를 관리할 배열
let viewState = {
  working: [],
  staging: [],
  local: [],
  remote: [],
};

// 상태표시 영역 작동 함수 (좋은 의견 공유 바랍니다...)
function resetDotColors() {
  [dotWorking, dotStaging, dotLocal, dotRemote].forEach((dot) => {
    dot.classList.remove("dot-blink");
    dot.style.backgroundColor = "#D3D7D9";
  });
}

// directory 관련 변수
const commit = "commit";
const remote = "remote";
function updateState(
  viewElement,
  dotElement,
  stateArray,
  filename,
  directory = "local"
) {
  // if (!stateArray.includes(filename)) {
  //   stateArray.push(filename);
  // }

  if (directory === commit || directory === remote) {
    if (directory === commit) {
      const commitText = stateArray.map((el) => {
        viewState.local.push(
          `<span>${el.id}[${el.files.map((file) => file).join(", ")}]</span>`
        );

        return `(message:${el.message}, file:${el.files
          .map((file) => file)
          .join(", ")}
          )`;
      });
      viewElement.innerText +=
        viewElement.innerText === ""
          ? `${commitText.join("")}`
          : `\n${commitText.join("")}`;
    } else {
      const commitText = stateArray.map((el) => `${el.file}: ${el.message}`);
      viewElement.innerText = commitText.join("\n");

      viewGitInnerTextStaging.textContent = "";
      viewGitInnerTextLocal.textContent = "";
      viewGitInnerTextLocal.insertAdjacentHTML(
        "beforeend",
        viewState.local.join("")
      );
    }
  } else {
    viewElement.innerText = `${stateArray.join("\n")}`;
  }

  dotElement.style.backgroundColor = "#F74E27";
  dotElement.classList.add("dot-blink");
}

function viewGitNow(filename, status) {
  resetDotColors();
  switch (status) {
    case "working":
      updateState(
        viewGitInnerTextWorking,
        dotWorking,
        repoState.files,
        filename
      );
      break;
    case "staging":
      updateState(
        viewGitInnerTextStaging,
        dotStaging,
        repoState.staging,
        filename
      );
      break;
    case "local":
      updateState(
        viewGitInnerTextLocal,
        dotLocal,
        repoState.commits,
        filename,
        commit
      );
      break;
    case "remote":
      updateState(
        viewGitInnerTextRemote,
        dotRemote,
        viewState.remote,
        filename,
        remote
      );
      break;
    default:
      console.error(`Unknown status: ${status}`);
  }
}

// Git 명령어 실행 함수
function executeGitCommand(command, arg) {
  switch (command) {
    case "init":
      return gitInit();
    case "add":
      return gitAdd(arg);
    case "commit":
      return gitCommit(arg);
    case "push":
      return gitPush();
    case "status":
      return gitStatus();
    case "log":
      return gitLog();
    case "branch":
      return gitBranch(arg);
    default:
      return { success: false, message: "알 수 없는 명령어입니다." };
  }
}

// git init
function gitInit() {
  if (repoState.isInitialized) {
    return { success: false, message: "저장소가 이미 초기화되어 있습니다." };
  }
  repoState.isInitialized = true;
  return { success: true, message: "빈 Git 저장소가 초기화되었습니다." };
}

// git add .
function gitAdd(file) {
  console.log("gitAdd called with file:", file);
  console.log("Current repoState:", JSON.stringify(repoState, null, 2));

  if (!repoState.isInitialized) {
    console.log("Repository not initialized");
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }

  let addedFiles = [];

  if (file === ".") {
    console.log("Adding all files");
    // 모든 파일을 스테이징 영역에 추가
    repoState.files.forEach((file) => {
      if (!repoState.staging.includes(file)) {
        repoState.staging.push(file);
        addedFiles.push(file);
      }
    });
  } else if (repoState.files.includes(file)) {
    console.log("Adding specific file:", file);
    if (!repoState.staging.includes(file)) {
      repoState.staging.push(file);
      addedFiles.push(file);
    }
  } else {
    console.log("File not found in working directory:", file);
    return { success: false, message: "작업 디렉토리에 해당 파일이 없습니다." };
  }

  console.log("Files added to staging:", addedFiles);
  console.log("Updated repoState:", JSON.stringify(repoState, null, 2));
  viewGitNow(addedFiles, "staging");

  if (addedFiles.length > 0) {
    return {
      success: true,
      message: `다음 파일들이 스테이징 영역에 추가되었습니다: ${addedFiles.join(
        ", "
      )}`,
      repoStatus: repoState,
    };
  } else {
    return {
      success: true,
      message: "스테이징할 새로운 변경사항이 없습니다.",
      repoStatus: repoState,
    };
  }
}

// git commit -m 'message'
function gitCommit(message) {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }
  if (repoState.staging.length === 0) {
    return { success: false, message: "커밋할 변경사항이 없습니다." };
  }
  const newCommit = {
    id: generateCommitId(),
    message: message,
    files: [...repoState.staging],
    parent: repoState.branches[repoState.currentBranch],
  };
  repoState.commits.push(newCommit);
  repoState.staging = [];
  repoState.branches[repoState.currentBranch] = newCommit.id;

  // 커밋된 파일들의 상태를 업데이트
  repoState.staging.forEach((file) => {
    repoState.trackedFiles[file] = false; // 파일이 커밋되어 변경되지 않은 상태로 표시
  });

  console.log(newCommit.files, "newCommit.files");

  viewGitNow(newCommit.files, "local");

  return {
    success: true,
    message: `새로운 커밋이 생성되었습니다: ${newCommit.id}`,
    repoStatus: repoState,
  };
}

// git push
function gitPush() {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }
  if (repoState.commits.length === 0) {
    return { success: false, message: "푸시할 커밋이 없습니다." };
  }

  // 새로운 커밋의 값과 비교하여
  // 이미 remote Repository에 있는 파일은 메시지만 변경
  // 파일이 없다면 파일과 메시지를 추가
  const updatedFiles = [];
  repoState.commits.forEach((commit) => {
    commit.files.forEach((file) => {
      const existingFile = viewState.remote.find((f) => f.file === file);
      if (existingFile) {
        existingFile.message = commit.message; // 메시지만 업데이트
      } else {
        viewState.remote.push({ file, message: commit.message });
      }
      updatedFiles.push({ file, message: commit.message });
    });
  });

  viewGitNow(updatedFiles, "remote");

  repoState.commits = [];
  return { success: true, message: "변경사항이 원격 저장소에 푸시되었습니다." };
}

// git status
function gitStatus() {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }
  let status = `현재 브랜치: ${repoState.currentBranch}\n`;
  status += `스테이징된 파일: ${repoState.staging.join(", ") || "없음"}\n`;
  status += `변경된 파일: ${
    repoState.files.filter((f) => !repoState.staging.includes(f)).join(", ") ||
    "없음"
  }`;
  return { success: true, message: status };
}

// git log
function gitLog() {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }
  if (repoState.commits.length === 0) {
    return { success: false, message: "커밋 히스토리가 없습니다." };
  }
  let log = repoState.commits
    .map((commit) => `커밋: ${commit.id}\n메시지: ${commit.message}\n`)
    .join("\n");
  return { success: true, message: log };
}

function gitBranch(branchName) {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }

  if (!branchName) {
    // 브랜치명 출력
    // 브랜치를 추가하고 싶다면 브랜치명을 입력해 주세요.
    const branchList = Object.keys(repoState.branches).map((branch) =>
      branch === repoState.currentBranch ? `*${branch}` : branch
    );
    return {
      success: false,
      message: `브랜치를 추가하고 싶다면 브랜치명을 입력해 주세요.\n현재 생성된 브랜치: ${branchList.join("\n")}`,
    };
  }

  if (repoState.commits.length === 0) {
    return {
      success: false,
      message: "레포지토리에 최소 하나의 커밋이 있어야 브랜치를 생성할 수 있습니다.",
    };
  }

  if (repoState.branches.hasOwnProperty(branchName)) {
    return {
      success: false,
      message: `${branchName} 브랜치가 이미 존재합니다.`,
    };
  }

  // 브랜치 생성
  repoState.branches[branchName] = null;
  return {
    success: true,
    message: `${branchName} 브랜치가 새로 생성되었습니다.`,
  };
}

// 파일 생성 함수
function createFileAction(filename) {
  if (!repoState.files.includes(filename)) {
    repoState.files.push(filename);
    viewGitNow(filename, "working");
    repoState.trackedFiles[filename] = true; // 새 파일은 변경된 것으로 표시
    return {
      success: true,
      message: `${filename} 파일이 생성되었습니다.`,
      repoStatus: repoState,
    };
  }
  return {
    success: false,
    message: `${filename} 파일이 이미 존재합니다.`,
    repoStatus: repoState,
  };
}

// 커밋 ID 생성 함수
function generateCommitId() {
  return Math.random().toString(36).substring(2, 10);
}

function getCurrentRepoState() {
  return { ...repoState };
}

// 외부에서 사용할 함수들을 노출
window.executeGitCommand = executeGitCommand;
window.createFileAction = createFileAction;
window.getCurrentRepoState = getCurrentRepoState;
