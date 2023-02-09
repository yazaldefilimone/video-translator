export type messageType = {
  audio: {
    initial: string;
    connection: string;
    start: string;
    progress: string;
    error: string;
    end: string;
  };
  video: {
    initial: string;
    connection: string;
    start: string;
    progress: string;
    error: string;
    end: string;
  };
  subtitle: {
    initial: string;
    connection: string;
    start: string;
    progress: string;
    error: string;
    end: string;
  };
};
export const message = {
  en: {
    audio: {
      initial: "preparing to remove audio from video file",
      connection: "connecting with video...",
      start: "starting to remove...",
      progress: "removing audio from video...",
      error: "there was an error in the process, please try again.",
      end: "successfully removed audio!",
    },
    video: {
      initial: "preparing to remove audio from video file",
      connection: "connecting with video...",
      start: "starting to remove...",
      progress: "removing audio from video...",
      error: "there was an error in the process, please try again",
      end: "successfully removed audio!",
    },
    subtitle: {
      initial: "",
      connection: "",
      start: "",
      progress: "removing audio from video...",
      error: "there was an error in the process, please try again",
      end: "successfully removed audio!",
    },
    terminal: {
      chooseVideo: "Selecione o video: ",
      chooseAudio: "",
      subtitle: "",
    },
  },
  pt: {
    audio: {
      initial: "preparando para remover o áudio do arquivo de vídeo!!!",
      connection: "conectando com o vídeo...",
      start: "começando a remover o vídeo...",
      progress: "removendo o áudio do vídeo...",
      error: "houve um erro no processo, tente novamente.",
      end: "áudio removido com sucesso!",
    },
    video: {
      initial: "preparando para remover o áudio do arquivo de vídeo!!!",
      connection: "conectando com o vídeo...",
      start: "começando a remover o vídeo...",
      progress: "removendo o áudio do vídeo...",
      error: "houve um erro no processo, tente novamente.",
      end: "áudio removido com sucesso!",
    },
    subtitle: {
      initial: "",
      connection: "",
      start: "",
      progress: "removal of audio from video...",
      error: "houve um erro no processo, tente novamente.",
      end: "áudio removido com sucesso!",
    },
    terminal: {
      chooseVideo: "Escolhe um video: ",
      chooseAudio: "",
      subtitle: "",
    },
  },
};
