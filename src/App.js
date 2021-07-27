import React, { useEffect, useRef } from "react";

function App() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({
    activePointers: [],
  });
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const p3Ref = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pointer = pointerRef.current;
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    const p3 = p3Ref.current;
    const points = [p1, p2, p3];

    const getOpenSlot = (activePointers) => {
      // Find order for new pointer
      // This method preserves continuous touches
      const orders = activePointers.map((pointer) => pointer.order);
      let result = points.length;
      for (let i = 0; i < points.length; i++) {
        if (!orders.includes(i)) {
          result = i;
          break;
        }
      }
      return result;
    };

    const updatePointDisplay = (activePointers) => {
      // Use pointer data to update display
      const orders = activePointers.map((pointer) => pointer.order);
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (orders.includes(i)) {
          const index = orders.indexOf(i);
          const active = pointer.activePointers[index];
          point.style.display = "block";
          points[i].style.transform = `translate(${active.x}px, ${active.y}px)`;
        } else {
          point.style.display = "none";
        }
      }

      // handle cursor display
      if (activePointers.length > 0) {
        canvas.style.cursor = "none";
      } else {
        canvas.style.cursor = "crosshair";
      }
    };

    const makePointer = (e) => {
      // Copy only the event properties we need
      return {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        order: getOpenSlot(pointer.activePointers),
      };
    };

    const pointerDown = (e) => {
      // Add pointer
      pointer.activePointers.push(makePointer(e));

      updatePointDisplay(pointer.activePointers);

      canvas.setPointerCapture(e.pointerId);
    };

    const pointerMove = (e) => {
      // Match move event to pointer data
      const ids = pointer.activePointers.map((pointer) => pointer.id);
      const activeIndex = ids.indexOf(e.pointerId);

      if (activeIndex !== -1) {
        const activePointer = pointer.activePointers[activeIndex];

        // Update position
        activePointer.x = e.clientX;
        activePointer.y = e.clientY;
      }

      updatePointDisplay(pointer.activePointers);
    };

    const pointerUp = (e) => {
      // Remove pointer
      const ids = pointer.activePointers.map((pointer) => pointer.id);
      const activeIndex = ids.indexOf(e.pointerId);
      pointer.activePointers.splice(activeIndex, 1);

      updatePointDisplay(pointer.activePointers);

      canvas.releasePointerCapture(e.pointerId);
    };

    // initial hide
    updatePointDisplay(pointer.activePointers);

    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
    };
  }, []);

  return (
    <div>
      <div
        ref={canvasRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        <div ref={p3Ref} className="pointer p3">
          3
        </div>
        <div ref={p2Ref} className="pointer p2">
          2
        </div>
        <div ref={p1Ref} className="pointer p1">
          1
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 24,
          maxWidth: 400,
          width: "calc(100% - 32px)",
          pointerEvents: "none",
          cursor: "crosshair",
        }}
      >
        A minimal demo exploring how to handle mouse and touch events
        consistently using pointer events. It handles up to three touches at a
        time. This method preserves touch order (which you may or may not want
        to do, depending on the situation).{" "}
        <a href="https://feed.grantcuster.com/">View source</a>
      </div>
    </div>
  );
}

export default App;
