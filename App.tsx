
import { Layout } from './components/Layout.tsx';
import { ResultsView } from './views/ResultsView.tsx'; // Updated Import
import { AppStage } from './types.ts';
import { useGameViewModel } from './viewmodels/useGameViewModel.ts';

// Views
import { IntroView } from './views/IntroView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { TopicSelectionView } from './views/TopicSelectionView.tsx';
import { QuizView } from './views/QuizView.tsx';
import { LoadingView } from './views/LoadingView.tsx';
import { ErrorView } from './views/ErrorView.tsx';

export default function App() {
  const { state, actions, swipeHandlers, t } = useGameViewModel();
  const { stage, language, userProfile, topicState, quizState, resultState } = state;

  return (
    <Layout 
      currentLanguage={language} 
      onLanguageChange={actions.setLanguage} 
      onHome={actions.goHome}
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      {stage === AppStage.INTRO && (
        <IntroView 
          t={t.intro} 
          onStart={actions.startIntro} 
          onHome={actions.goHome}
          onResetProfile={actions.resetProfile}
          language={language}
          setLanguage={actions.setLanguage}
          // Debug Actions connected here
          onDebugBypass={actions.startDebugQuiz}
          onDebugPreview={actions.previewResults}
          onDebugLoading={actions.previewLoading}
          onDebugSeed={actions.triggerSeeding}
        />
      )}
      
      {stage === AppStage.PROFILE && (
        <ProfileView 
          t={t.profile} 
          userProfile={userProfile} 
          language={language}
          setLanguage={actions.setLanguage}
          onUpdate={actions.updateProfile}
          onSubmit={actions.submitProfile}
          onHome={actions.goHome}
        />
      )}
      
      {stage === AppStage.TOPIC_SELECTION && (
        <TopicSelectionView 
          t={{...t.topics, difficulty: t.difficulty, btn_back: t.common.btn_back}} 
          state={{
            ...topicState,
            errorMsg: resultState.errorMsg,
            userProfile // Pass profile for badges
          }}
          language={language}
          actions={{
            goBack: actions.goBack,
            goHome: actions.goHome,
            shuffleTopics: actions.shuffleTopics,
            selectCategory: actions.selectCategory,
            proceedToSubTopics: actions.proceedToSubTopics, // Added missing action
            setCustomTopic: actions.setCustomTopic,
            shuffleSubTopics: actions.shuffleSubTopics,
            selectSubTopic: actions.selectSubTopic,
            setDifficulty: actions.setDifficulty,
            startQuiz: actions.startQuiz,
            editProfile: actions.editProfile,
            setLanguage: actions.setLanguage
          }}
        />
      )}
      
      {stage === AppStage.LOADING_QUIZ && (
        <LoadingView 
          text={t.loading.gen_vectors} 
          logs={t.loading.logs} 
          syncText={t.loading.sync}
        />
      )}
      
      {stage === AppStage.QUIZ && (
        <QuizView 
          questions={quizState.questions}
          currentIndex={quizState.currentQuestionIndex}
          selectedOption={quizState.selectedOption}
          topicLabel={quizState.currentTopicName || "Quiz"}
          onSelectOption={actions.selectOption}
          onConfirm={actions.confirmAnswer}
          onHome={actions.goHome}
          onBack={actions.goBack} // Pass back action
          language={language}
          batchProgress={quizState.batchProgress} // Pass batch info
          isSubmitting={quizState.isSubmitting} // Pass lock state
        />
      )}
      
      {stage === AppStage.ANALYZING && (
        <LoadingView 
          text={t.loading.analyzing} 
          logs={t.loading.logs} 
          syncText={t.loading.sync}
        />
      )}
      
      {stage === AppStage.RESULTS && resultState.evaluation && (
        <ResultsView 
          data={resultState.evaluation}
          sessionResults={resultState.sessionResults}
          userProfile={userProfile}
          onRestart={actions.resetApp} 
          onHome={actions.goHome}
          onNextTopic={actions.nextTopicInQueue}
          remainingTopics={quizState.remainingTopics}
          nextTopicName={quizState.nextTopicName} // Pass next topic name
          language={language} 
        />
      )}
      
      {stage === AppStage.ERROR && (
        <ErrorView 
          t={t.error}
          message={resultState.errorMsg} 
          onReset={actions.resetApp} 
        />
      )}
    </Layout>
  );
}
