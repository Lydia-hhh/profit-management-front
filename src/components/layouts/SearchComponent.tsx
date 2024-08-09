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
  onAddSuccess: () => void; 
}

interface SearchResultItem {
  item_id: string;
  item_name: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ visible, onCancel, onSelect, selectedPortfolioId, onAddSuccess }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = async (typeIn: string) => {
    try {
      const action = await dispatch(fuzzySearchList({ typeIn }) as any);
      if (fuzzySearchList.fulfilled.match(action)) {
        const payload = action.payload as { data: SearchResultItem[] };
        setSearchResults(payload.data || []);
        console.log("check fuzzy data: ",payload.data)
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
    setIsModalVisible(false); // close AddEntryModal
    onAddSuccess(); 
    onCancel(); // close SearchComponent modal
  };
  return (
    <>
      <Modal title="Search" visible={visible} onCancel={onCancel} footer={null}>
        <div style={{ display: 'flex', marginBottom: 16 }}>
          <AutoComplete
            options={searchResults.map(item => ({
              value: item.item_id, 
              label: `${item.item_id} (${item.item_name})` 
            }))}
            style={{ width: 300, marginRight: 8 }}
            onSearch={handleSearchInput}
            onSelect={handleSelect}
            value={searchInput} 
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
        onAddSuccess={onAddSuccess}
      />
    </>
  );
};

export default SearchComponent;
