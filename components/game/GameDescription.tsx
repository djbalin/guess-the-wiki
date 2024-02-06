export function GameDescription() {
  return (
    <div className="flex flex-col">
      <h1 className="mb-2 text-5xl xl:text-7xl">
        Guess the Wikipedia article!
      </h1>
      <h2 className="w-[40%] px-2 mb-4">
        The titles of Wikipedia articles and their content have been shuffled!
        Your task is to drag the title to the content that it represents (### in
        the content indicates that a word from the title has been censored).
      </h2>
    </div>
  );
}