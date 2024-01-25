function CancelWrapper({ cancelWrapperClick, show }) {
  if (!show) return <></>;

  return (
    <div className="fixed inset-0 z-[100]" onClick={cancelWrapperClick}></div>
  );
}

export default CancelWrapper;
