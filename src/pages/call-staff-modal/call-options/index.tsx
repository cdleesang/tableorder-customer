import { CallOption } from '@oz-k/cdleesang-tableorder-api-sdk/lib/structures/CallOption';
import './index.scss';
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
    <div className={`options${props.isCountable ? ' countable' : ''}`}>
      {
        props.options.map(option => (
          <div
            className={`option${props.currentOptions[option.id].isSelected ? ' selected' : ''}`}
            onClick={() => {
              props.setCurrentOptions(prev => ({
                ...prev,
                [option.id]: {
                  ...prev[option.id],
                  isSelected: !prev[option.id].isSelected,
                  count: prev[option.id].isSelected ? 1 : prev[option.id].count
                }
              }));
            }}
          >
            <span>{option.title}</span>
            {
              props.isCountable && (
                <div
                  className="counter-container"
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    className="minus"
                    onClick={() => props.setCurrentOptions(prev => ({
                      ...prev,
                      [option.id]: {
                        ...prev[option.id],
                        count: Math.max(1, prev[option.id].count - 1)
                      }}
                    ))}  
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                  <span className="counter">{props.currentOptions[option.id].count}</span>
                  <div
                    className="plus"
                    onClick={() => props.setCurrentOptions(prev => ({
                      ...prev,
                      [option.id]: {
                        ...prev[option.id],
                        isSelected: true,
                        count: prev[option.id].count + 1
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