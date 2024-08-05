import React, { useState } from 'react';
import { Modal, Input, AutoComplete, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { fuzzySearchList } from '../../store/features/portfolioSlice';
import AddEntryModal from './AddEntryModal';

interface SearchComponentProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (item: any) => void;
  selectedPortfolioId: string | null;
}

interface SearchResultItem {
  item_id: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ visible, onCancel, onSelect, selectedPortfolioId }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (typeIn: string) => {
    console.log("User input:", typeIn);
    try {
      const action = await dispatch(fuzzySearchList({ typeIn }) as any);
      console.log("action:", action);
      if (fuzzySearchList.fulfilled.match(action)) {
        console.log("Search results:", action.payload);
        const payload = action.payload as { data: SearchResultItem[] };
        setSearchResults(payload.data || []);
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (err: any) {
      console.error("Error fetching search results:", err);
      alert("Server error, please contact developer");
      setSearchResults([]);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    handleSearch(value);
  };

  const handleSelect = (item_id: string) => {
    setSearchInput(item_id); // Store selected value in searchInput
    setSearchResults([]); 
  };

  const handleButtonClick = () => {
    if (searchInput.trim() !== '') {
      setIsModalVisible(true); 
    } else {
      alert("Please select an item before proceeding.");
    }
  };

  const handleModalOk = (values: any) => {
    console.log("Form values:", values);
    setIsModalVisible(false); // close AddEntryModal
  };

  return (
    <>
      <Modal title="Search" visible={visible} onCancel={onCancel} footer={null}>
        <div style={{ display: 'flex', marginBottom: 16 }}>
          <AutoComplete
            options={searchResults.map(item => ({ value: item.item_id }))}
            style={{ width: 300, marginRight: 8 }}
            onSearch={handleSearchInput}
            onSelect={handleSelect}
            value={searchInput} // Bind value to searchInput state
            placeholder="Enter search term"
          >
            <Input />
          </AutoComplete>
          <Button
            type="primary"
            onClick={handleButtonClick}
            disabled={searchInput.trim() === ''}
          >
            Open Add Entry Modal
          </Button>
        </div>
      </Modal>
      <AddEntryModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onAdd={handleModalOk}
        item_id={searchInput} // Pass searchInput as item_id
        portfolio_id={selectedPortfolioId} 
      />
    </>
  );
};

export default SearchComponent;
