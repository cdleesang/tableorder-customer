import { CallOption } from '@cdleesang/tableorder-api-sdk/lib/structures/CallOption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function CallOptions(props: {
  currentOptions: Record<string, {
    id: number;
    isSelected: boolean;
    count: number;
  }>;
  setCurrentOptions: React.Dispatch<React.SetStateAction<Record<string, {
    id: number;
    isSelected: boolean;
    count: number;
  }>>>;
  options: CallOption[];
  isCountable?: boolean;
}) {
  return (
    <div className={`w-full flex flex-wrap font-semibold gap-5`}>
      {
        props.options.map((option, idx) => (
          <div
            className={`flex flex-col gap-5 text-center rounded-2xl ${props.isCountable ? 'p-3.5' : 'px-5 py-4'} ${props.currentOptions[option.id].isSelected ? 'bg-button' : 'bg-secondary'}`}
            key={idx}
            onClick={() => {
              props.setCurrentOptions(prev => ({
                ...prev,
                [option.id]: {
                  ...prev[option.id],
                  isSelected: !prev[option.id].isSelected,
                  count: prev[option.id].isSelected ? 1 : prev[option.id].count,
                },
              }));
            }}
          >
            <span>{option.title}</span>
            {
              props.isCountable && (
                <div
                  className="bg-primary bg-opacity-40 rounded-full flex justify-around items-center gap-4 px-2.5 py-2"
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    onClick={() => props.setCurrentOptions(prev => ({...prev,
                      [option.id]: {
                        ...prev[option.id],
                        count: Math.max(1, prev[option.id].count - 1),
                      }}
                    ))}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                  <span className="font-mono">{props.currentOptions[option.id].count}</span>
                  <div
                    onClick={() => props.setCurrentOptions(prev => ({...prev,
                      [option.id]: {
                        ...prev[option.id],
                        isSelected: true,
                        count: prev[option.id].count + 1,
                      }}
                    ))}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  );
}

export default CallOptions;