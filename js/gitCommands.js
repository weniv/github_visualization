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

const branches = [];

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

// 로그 반환해주는 함수
function getLogs(arr) {
  const logs = arr.map((el) => {
    const log = `${el.id || el.commitId}[${el.message}]`;
    return `${log}`;
  });

  return logs;
}

// directory 관련 변수
const commit = "commit";
const remote = "remote";
const checkout = "checkout";
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
    viewGitInnerTextStaging.textContent = "";
    const commitText = getLogs(stateArray);

    viewElement.innerText = commitText.join(",\n");
  } else if (directory === checkout) {
    const commitText = getLogs(stateArray);
    const pushText = getLogs(viewState.remote);

    viewElement.innerText = commitText.join(",\n");
    viewGitInnerTextRemote.innerText = pushText.join(",\n");
  } else {
    // 그 외
    viewElement.innerText = `${stateArray.join(", ")}`;
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
    case "checkout":
      updateState(
        viewGitInnerTextLocal,
        dotLocal,
        repoState.commits,
        filename,
        checkout
      );
      break;
    case "remote":
      updateState(
        viewGitInnerTextRemote,
        dotRemote,
        repoState.commits,
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
    case "clone":
      return gitClone();
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
    case "checkout":
      return gitCheckout(arg);
    case "pull":
      return gitPull(arg);
    default:
      return { success: false, message: "알 수 없는 명령어입니다." };
  }
}

/**
 *
 * @param {*} name 브랜치명
 * @param {*} files 브랜치에 저장할 files(type: array)
 * @param {*} staging 브랜치에 저장할 staging(type: array)
 * @param {*} commits 브랜치에 저장할 commits(type: array)
 * @param {*} remote 브랜치에 저장할 remote(type: array)
 */
function addBranchStatus(name, files, staging, commits, remote) {
  const branchData = {
    name: name,
    files: JSON.parse(JSON.stringify(files)),
    staging: JSON.parse(JSON.stringify(staging)),
    commits: JSON.parse(JSON.stringify(commits)),
    remote: JSON.parse(JSON.stringify(remote)),
  };
  branches.push(branchData);
}

// git init
function gitInit() {
  if (repoState.isInitialized) {
    return { success: false, message: "저장소가 이미 초기화되어 있습니다." };
  }
  repoState.isInitialized = true;
  addBranchStatus("main", repoState.files, [], [], []);
  return { success: true, message: "빈 Git 저장소가 초기화되었습니다." };
}

// git clone
function gitClone() {
  if (repoState.isInitialized) {
    return { success: false, message: "저장소가 불러와져 있는 상태입니다." };
  }
  repoState.isInitialized = true;
  repoState.branches["develop1"] = null;
  repoState.branches["develop2"] = null;
  addBranchStatus("main", repoState.files, [], [], []);
  addBranchStatus("develop1", repoState.files, [], [], []);
  addBranchStatus("develop2", repoState.files, [], [], []);
  return { success: true, message: "원격 저장소 데이터를 불러옵니다." };
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
    log: "",
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
        viewState.remote.push({
          commitId: commit.id,
          file: file,
          message: commit.message,
        });
      }
      updatedFiles.push({
        commitId: commit.id,
        file: file,
        message: commit.message,
      });
    });
  });

  viewGitNow(updatedFiles, "remote");

  return { success: true, message: "변경사항이 원격 저장소에 푸시되었습니다." };
}

// git pull
function gitPull(branchName) {
  // 1. 저장소 초기화 확인
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }

  // 2. 브랜치명 입력 확인
  if (!branchName) {
    return { success: false, message: "브랜치명을 입력해 주세요." };
  }

  // 3. 브랜치 존재 확인
  if (!repoState.branches.hasOwnProperty(branchName)) {
    return {
      success: false,
      message: `${branchName} 브랜치가 존재하지 않습니다.`,
    };
  }

  // 4. 현재 브랜치와 지정된 브랜치의 상태 가져오기
  const currentBranchName = repoState.currentBranch;
  const currentBranchData = branches.find(
    (branch) => branch.name === currentBranchName
  );
  const branchToPull = branches.find((branch) => branch.name === branchName);

  if (!branchToPull) {
    return { success: false, message: `브랜치를 찾을 수 없습니다.` };
  }

  // 5. 최신 커밋 ID를 기준으로 비교
  const latestCommitIdInBranch =
    branchToPull.remote.length > 0
      ? branchToPull.remote[branchToPull.remote.length - 1].commitId
      : null;
  const latestCommitIdInCurrentBranch =
    currentBranchData.remote.length > 0
      ? currentBranchData.remote[currentBranchData.remote.length - 1].commitId
      : null;

  // 6. 원격 브랜치에 새로운 커밋이 있는지 확인
  if (latestCommitIdInBranch === latestCommitIdInCurrentBranch) {
    return {
      success: false,
      message:
        "원격 레포지토리 새로운 변경 사항이 없습니다. Push 후 다시 시도해 주세요.",
    };
  }

  // 7. 브랜치 상태 업데이트
  repoState.files = [...branchToPull.files];
  repoState.staging = []; // 클리어 스테이징 영역
  repoState.commits = [...branchToPull.commits];
  viewState.remote = [...branchToPull.remote];

  // 8. 시각화 업데이트
  viewGitNow(repoState.files, "working");
  viewGitNow(repoState.commits, "checkout");
  viewGitNow(viewState.remote, "remote");

  return {
    success: true,
    message: `${branchName} 브랜치에서 최신 변경 사항을 가져와서 현재 브랜치에 병합했습니다.`,
  };
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
    const branchList = Object.keys(repoState.branches).map((branch) =>
      branch === repoState.currentBranch ? `*${branch}` : branch
    );
    return {
      success: false,
      message: `브랜치를 추가하고 싶다면 브랜치명을 입력해 주세요.\n생성된 브랜치:\n ${branchList.join(
        "\n"
      )}`,
    };
  }

  if (repoState.commits.length === 0) {
    return {
      success: false,
      message:
        "레포지토리에 최소 하나의 커밋이 있어야 브랜치를 생성할 수 있습니다.",
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
  addBranchStatus(
    branchName,
    repoState.files,
    repoState.staging,
    repoState.commits,
    viewState.remote
  );
  return {
    success: true,
    message: `${branchName} 브랜치가 새로 생성되었습니다.`,
  };
}

function gitCheckout(branchName) {
  if (!repoState.isInitialized) {
    return { success: false, message: "Git 저장소가 초기화되지 않았습니다." };
  }

  if (!branchName) {
    return { success: false, message: "이동할 브랜치명을 입력해 주세요." };
  }

  if (!repoState.branches.hasOwnProperty(branchName)) {
    return {
      success: false,
      message: `${branchName} 브랜치가 존재하지 않습니다. 브랜치명을 다시 한번 확인해 주세요.`,
    };
  }

  if (repoState.currentBranch === branchName) {
    return {
      success: false,
      message: `${branchName} 브랜치는 현재 브랜치입니다.`,
    };
  }

  const beforeBranch = branches.find(
    (el) => el.name === repoState.currentBranch
  );
  const checkoutBranch = branches.find((el) => el.name === branchName);
  console.log(checkoutBranch, "checkoutBranch");
  beforeBranch.files = JSON.parse(JSON.stringify(repoState.files));
  beforeBranch.commits = JSON.parse(JSON.stringify(repoState.commits));
  beforeBranch.remote = JSON.parse(JSON.stringify(viewState.remote));
  console.log(beforeBranch, "beforeBranch");

  const branchRepoState = {
    isInitialized: true,
    files: [...checkoutBranch.files],
    staging: [],
    commits: [...checkoutBranch.commits],
    currentBranch: checkoutBranch.name,
    branches: repoState.branches,
    trackedFiles: {}, // 파일 이름을 키로, 마지막 커밋 이후 변경 여부를 값으로 가집니다.
  };

  repoState = branchRepoState;
  viewState.remote = [...checkoutBranch.remote];
  console.log(repoState, "repoState");
  viewGitNow(checkoutBranch.files, "working");
  viewGitNow(checkoutBranch.commits, "checkout");
  // viewGitNow(checkoutBranch.remote, "remote");
  return {
    success: true,
    message: `${branchName}로 체크아웃 되었습니다.`,
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

// CLI 
const btnPractice = document.getElementById("btn-practice");
const btnCli = document.getElementById("btn-cli");
const cliHidden = document.getElementById("cli-hidden");
const commandPanelWithText = document.getElementById("command-panel-with-text");
const commandPanelWithoutText = document.getElementById("command-panel-without-text");

btnCli.addEventListener("click", function() {
  cliHidden.style.display = "block";
  commandPanelWithText.style.display = "none";
  commandPanelWithoutText.style.display = "none";
})

btnPractice.addEventListener("click", function() {
  cliHidden.style.display = "none";
  commandPanelWithText.style.display = "block";
  commandPanelWithoutText.style.display = "block";
})
