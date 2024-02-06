export function HorizontalRule(props: { showPlayingField: boolean }) {
  return props.showPlayingField ? (
    <hr className="border-[1px] opacity-30 mt-10 mb-8 " />
  ) : (
    <></>
  );
}
